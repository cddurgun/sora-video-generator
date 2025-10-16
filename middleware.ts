import { auth } from '@/auth'

export default auth((req) => {
  // If user is not authenticated and trying to access dashboard, redirect to login
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    return Response.redirect(loginUrl)
  }
})

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*'],
}
