import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is authenticated, prevent them from accessing the sign-in, sign-up, or verify pages
  if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify'))) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home if already authenticated
  }

  // If not authenticated and trying to access protected routes, redirect to sign-in page
  if (!token && (url.pathname.startsWith('/add-cart') || url.pathname.startsWith('/profile') || url.pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url)); // Redirect to sign-in
  }

  return NextResponse.next(); // Proceed with the request
}

// Matcher for protected routes
export const config = {
  matcher: [ '/profile', '/checkout'], // Specify only protected routes
};