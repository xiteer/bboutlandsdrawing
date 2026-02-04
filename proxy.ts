import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';

// Routes that require authentication
const protectedRoutes = ['/admin'];

// Routes that are public
const publicRoutes = ['/login', '/drawings', '/drawing', '/'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Decrypt the session from the cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const session = await decrypt(cookie);

  // Redirect to /login if the user is not authenticated and trying to access protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to /admin if the user is authenticated and trying to access login
  if (path === '/login' && session?.userId) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.json$).*)'],
};
