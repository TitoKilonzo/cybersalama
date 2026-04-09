import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const RegisterSchema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  phone:    z.string().optional(),
  area:     z.string().optional(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  const body   = await req.json()
  const parsed = RegisterSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 422 })
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: parsed.data.email },
        ...(parsed.data.phone ? [{ phone: parsed.data.phone }] : []),
      ],
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'Email or phone already registered' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  const user = await prisma.user.create({
    data: {
      name:  parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      area:  parsed.data.area  ?? null,
      passwordHash,
    },
  })

  // Create session
  const token     = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  })

  const response = NextResponse.json({ ok: true, userId: user.id }, { status: 201 })
  response.cookies.set('salama_session', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires:  expiresAt,
    path:     '/',
  })

  return response
}
