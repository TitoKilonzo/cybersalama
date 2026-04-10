import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { prisma } from '@/lib/prisma'
import { Language } from '@prisma/client'
import { handleBotMessage } from '@/lib/whatsapp/bot'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

// Twilio sends a POST with form-encoded body
export async function POST(req: NextRequest) {
  try {
    const body = await req.formData()
    const from    = body.get('From')    as string  // e.g. "whatsapp:+254712345678"
    const msgBody = body.get('Body')    as string
    const to      = body.get('To')      as string

    if (!from || !msgBody) {
      return new NextResponse('Bad request', { status: 400 })
    }

    const phone = from.replace('whatsapp:', '').trim()

    // Get or create bot session
    let session = await prisma.botSession.findUnique({ where: { phone } })
    if (!session) {
      session = await prisma.botSession.create({
        data: { phone, state: 'IDLE', language: 'ENGLISH' }
      })
    }

    // Process message through bot engine
    const { reply, newState, newLanguage } = await handleBotMessage({
      phone,
      message: msgBody.trim(),
      session,
    })

    // Update session state
    const language: Language = (newLanguage ?? session.language) as Language
    await prisma.botSession.update({
      where: { phone },
      data: {
        state: newState,
        language,
        updatedAt: new Date(),
      },
    })

    // Send reply via Twilio
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to: from,
      body: reply,
    })

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[SalamaBot webhook error]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// Twilio webhook verification (GET for setup)
export async function GET() {
  return NextResponse.json({ status: 'SalamaBot webhook active' })
}
