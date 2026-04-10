import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/dashboard']
const CSRF_APIS = ['/api/reports', '/api/auth/register']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // CSRF
  if (CSRF_APIS.some(p => pathname.startsWith(p))) {
    if (['POST','PUT','PATCH','DELETE'].includes(req.method)) {
      const origin = req.headers.get('origin')
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
      const host   = req.headers.get('host')
      const allowed = new Set([appUrl, req.nextUrl.origin])
      if (host) {
        allowed.add(`https://${host}`)
        allowed.add(`http://${host}`)
      }
      if (origin && !allowed.has(origin)) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
  }

  // Twilio webhook gate
  if (pathname === '/api/webhook/whatsapp' && !req.headers.get('x-twilio-signature')) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Auth guard — check NextAuth JWT cookie OR legacy session cookie
  if (PROTECTED.some(p => pathname.startsWith(p))) {
    const nextAuthToken = req.cookies.get('authjs.session-token')?.value
                      || req.cookies.get('__Secure-authjs.session-token')?.value
                      || req.cookies.get('next-auth.session-token')?.value
                      || req.cookies.get('__Secure-next-auth.session-token')?.value
    const legacyToken  = req.cookies.get('salama_session')?.value

    if (!nextAuthToken && !legacyToken) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/reports/:path*', '/api/auth/register', '/api/webhook/whatsapp'],
}
