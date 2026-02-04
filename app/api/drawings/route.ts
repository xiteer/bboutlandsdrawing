import { NextResponse } from 'next/server';
import { put, head } from '@vercel/blob';
import { verifySession } from '@/app/lib/session';

export async function POST(request: Request) {
  // Verify user is authenticated
  const session = await verifySession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    
    // Generate unique ID based on timestamp
    const id = Date.now().toString();
    const timestamp = new Date().toISOString();
    
    const drawing = {
      id,
      timestamp,
      ...data,
    };
    
    // Store in Vercel Blob
    const blob = await put(`drawings/${id}.json`, JSON.stringify(drawing, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return NextResponse.json({ id, success: true, url: blob.url });
  } catch (error) {
    console.error('Error saving drawing:', error);
    return NextResponse.json(
      { error: 'Failed to save drawing' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Drawing ID is required' },
        { status: 400 }
      );
    }

    // Validate ID format (should be numeric timestamp)
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid drawing ID format' },
        { status: 400 }
      );
    }
    
    // Check if blob exists and fetch content
    try {
      const blobDetails = await head(`drawings/${id}.json`);
      
      // Fetch the blob content
      const response = await fetch(blobDetails.url);
      if (!response.ok) {
        throw new Error('Failed to fetch blob content');
      }
      
      const drawing = await response.json();
      
      return NextResponse.json(drawing);
    } catch (error) {
      return NextResponse.json(
        { error: 'Drawing not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error loading drawing:', error);
    return NextResponse.json(
      { error: 'Failed to load drawing' },
      { status: 500 }
    );
  }
}
