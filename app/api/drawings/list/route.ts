import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DRAWINGS_DIR = path.join(process.cwd(), 'data', 'drawings');

export async function GET() {
  try {
    if (!existsSync(DRAWINGS_DIR)) {
      return NextResponse.json([]);
    }

    const files = await readdir(DRAWINGS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const drawings = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(DRAWINGS_DIR, file);
        const data = await readFile(filePath, 'utf-8');
        const drawing = JSON.parse(data);
        
        return {
          id: drawing.id,
          name: drawing.name || 'Unnamed Drawing',
          timestamp: drawing.timestamp,
          playerCount: drawing.players?.length || 0,
          prizeCount: drawing.prizes?.length || 0,
        };
      })
    );

    // Sort by timestamp, newest first
    drawings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(drawings);
  } catch (error) {
    console.error('Error listing drawings:', error);
    return NextResponse.json(
      { error: 'Failed to list drawings' },
      { status: 500 }
    );
  }
}
