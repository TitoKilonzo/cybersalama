import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ReportSchema = z.object({
  type:        z.enum(['PHISHING','SIM_SWAP','MPESA_FRAUD','FAKE_LOAN','ACCOUNT_TAKEOVER','FAKE_JOB','ROMANCE_SCAM','INVESTMENT_SCAM','OTHER']),
  area:        z.string().min(2).max(80),
  severity:    z.enum(['LOW','MEDIUM','HIGH','CRITICAL']).default('MEDIUM'),
  title:       z.string().min(5).max(120),
  description: z.string().min(10).max(2000),
  source:      z.enum(['WEB','WHATSAPP','ADMIN']).default('WEB'),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type     = searchParams.get('type')
  const severity = searchParams.get('severity')
  const area     = searchParams.get('area')
  const limit    = parseInt(searchParams.get('limit') ?? '50')

  const reports = await prisma.fraudReport.findMany({
    where: {
      status: { in: ['PENDING', 'VERIFIED'] },
      ...(type     && { type:     type     as any }),
      ...(severity && { severity: severity as any }),
      ...(area     && { area:     { contains: area, mode: 'insensitive' } }),
    },
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 200),
    select: {
      id: true, type: true, area: true, severity: true, status: true,
      title: true, description: true, latitude: true, longitude: true,
      verified: true, upvotes: true, source: true, createdAt: true,
    },
  })

  return NextResponse.json({ reports })
}

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = ReportSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }

    const report = await prisma.fraudReport.create({
      data: {
        ...parsed.data,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ report }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/reports]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
