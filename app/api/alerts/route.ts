import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const area   = searchParams.get('area')
  const active = searchParams.get('active')

  const alerts = await prisma.alert.findMany({
    where: {
      ...(active !== 'false' && { active: true }),
      ...(area && {
        OR: [
          { area: null },
          { area: { contains: area, mode: 'insensitive' } },
        ],
      }),
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    take: 20,
  })

  return NextResponse.json({ alerts })
}

const AlertSchema = z.object({
  titleEn: z.string().min(5),
  titleSw: z.string().min(5),
  bodyEn:  z.string().min(10),
  bodySw:  z.string().min(10),
  area:    z.string().optional(),
  severity: z.enum(['LOW','MEDIUM','HIGH','CRITICAL']),
  expiresAt: z.string().datetime().optional(),
})

// Admin only — create alert
export async function POST(req: NextRequest) {
  // In production: verify admin auth header
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = AlertSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const alert = await prisma.alert.create({
    data: {
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  })

  return NextResponse.json({ alert }, { status: 201 })
}
