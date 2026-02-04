import { NextResponse } from 'next/server';
import { createSession } from '@/app/lib/session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Check password against environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      await createSession();
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
