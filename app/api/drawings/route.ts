import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { verifySession } from '@/app/lib/session';

const DRAWINGS_DIR = path.join(process.cwd(), 'data', 'drawings');

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DRAWINGS_DIR)) {
    await mkdir(DRAWINGS_DIR, { recursive: true });
  }
}

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
    
    await ensureDataDir();
    const filePath = path.join(DRAWINGS_DIR, `${id}.json`);
    await writeFile(filePath, JSON.stringify(drawing, null, 2));
    
    return NextResponse.json({ id, success: true });
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
    
    const filePath = path.join(DRAWINGS_DIR, `${id}.json`);
    
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Drawing not found' },
        { status: 404 }
      );
    }
    
    const data = await readFile(filePath, 'utf-8');
    const drawing = JSON.parse(data);
    
    return NextResponse.json(drawing);
  } catch (error) {
    console.error('Error loading drawing:', error);
    return NextResponse.json(
      { error: 'Failed to load drawing' },
      { status: 500 }
    );
  }
}
