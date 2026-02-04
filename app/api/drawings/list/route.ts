import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // List all blobs in the drawings folder
    const { blobs } = await list({
      prefix: 'drawings/',
      limit: 1000, // Set a reasonable limit
    });

    // Fetch and parse each drawing's metadata only
    const drawings = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          if (!response.ok) {
            console.error(`Failed to fetch blob ${blob.pathname}`);
            return null;
          }
          
          const drawing = await response.json();
          
          // Validate required fields
          if (!drawing.id || !drawing.timestamp) {
            console.error(`Invalid drawing data in ${blob.pathname}`);
            return null;
          }
          
          return {
            id: drawing.id,
            name: drawing.name || 'Unnamed Drawing',
            timestamp: drawing.timestamp,
            playerCount: drawing.players?.length || 0,
            prizeCount: drawing.prizes?.length || 0,
          };
        } catch (error) {
          console.error(`Error parsing blob ${blob.pathname}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed parses and sort by timestamp, newest first
    const validDrawings = drawings.filter((d): d is NonNullable<typeof d> => d !== null);
    validDrawings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(validDrawings);
  } catch (error) {
    console.error('Error listing drawings:', error);
    return NextResponse.json(
      { error: 'Failed to list drawings' },
      { status: 500 }
    );
  }
}
