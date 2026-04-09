import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const PROTECTED = ['/dashboard']
const CSRF_APIS = ['/api/reports', '/api/auth/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── CSRF protection on sensitive APIs ─────────────────────────────
  if (CSRF_APIS.some(p => pathname.startsWith(p))) {
    const method = req.method.toUpperCase()
    if (['POST','PUT','PATCH','DELETE'].includes(method)) {
      const origin = req.headers.get('origin')
      const host   = req.headers.get('host')
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${host}`
      if (origin && !origin.startsWith(appUrl) && origin !== `https://${host}` && origin !== `http://${host}`) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
  }

  // ── WhatsApp webhook: require Twilio signature ────────────────────
  if (pathname === '/api/webhook/whatsapp') {
    if (!req.headers.get('x-twilio-signature')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    return NextResponse.next()
  }

  // ── Auth guard ─────────────────────────────────────────────────────
  if (PROTECTED.some(p => pathname.startsWith(p))) {
    // Check NextAuth session
    const session = await auth()
    // Also check legacy cookie session
    const cookie  = req.cookies.get('salama_session')?.value
    if (!session && !cookie) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/reports/:path*', '/api/auth/:path*', '/api/webhook/whatsapp'],
}
