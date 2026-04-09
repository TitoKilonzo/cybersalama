import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category   = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const search     = searchParams.get('q')

  const tips = await prisma.tip.findMany({
    where: {
      published: true,
      ...(category   && { category:   category   as any }),
      ...(difficulty && { difficulty: difficulty as any }),
      ...(search     && {
        OR: [
          { titleEn: { contains: search, mode: 'insensitive' } },
          { titleSw: { contains: search, mode: 'insensitive' } },
          { tags:    { has: search.toLowerCase() } },
        ],
      }),
    },
    orderBy: { views: 'desc' },
    take: 50,
  })

  return NextResponse.json({ tips })
}
