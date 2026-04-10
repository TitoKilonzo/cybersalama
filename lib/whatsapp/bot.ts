/**
 * SalamaBot — WhatsApp Conversation State Machine
 *
 * States:
 *   IDLE          → greeting, language selection
 *   MENU          → main menu shown
 *   TIPS          → browsing daily tip
 *   QUIZ          → quiz flow
 *   REPORT        → fraud reporting flow
 *   REPORT_TYPE   → waiting for threat type
 *   REPORT_AREA   → waiting for area
 *   REPORT_DESC   → waiting for description
 *   ALERTS        → viewing active alerts
 */

import { prisma } from '@/lib/prisma'


import type { Language } from '@prisma/client'

interface BotInput {
  phone:   string
  message: string
  session: { phone:string; state:string; language:Language; context:unknown; updatedAt:Date; createdAt:Date; id:string }
}

interface BotOutput {
  reply:       string
  newState:    string
  newLanguage?: Language
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────
const t = {
  welcome: {
    ENGLISH: `👋 Welcome to *CyberSalama* — your community cybersecurity platform!\n\nChoose your language:\n1️⃣ English\n2️⃣ Kiswahili`,
    SWAHILI: `👋 Karibu *CyberSalama* — jukwaa lako la usalama wa mtandao!\n\nChagua lugha yako:\n1️⃣ English\n2️⃣ Kiswahili`,
  },
  menu: {
    ENGLISH: `🛡️ *SalamaBot Main Menu*\n\nWhat would you like to do?\n\n1️⃣ Get today's security tip\n2️⃣ View active fraud alerts\n3️⃣ Report a fraud/scam\n4️⃣ Take a safety quiz\n5️⃣ Ask a security question\n\nType a number or ask me anything in plain English.`,
    SWAHILI: `🛡️ *Menyu Kuu ya SalamaBot*\n\nUnataka kufanya nini?\n\n1️⃣ Pata kidokezo cha usalama cha leo\n2️⃣ Angalia tahadhari za udanganyifu\n3️⃣ Ripoti udanganyifu/ulaghai\n4️⃣ Chukua jaribio la usalama\n5️⃣ Uliza swali la usalama\n\nAndika nambari au uniulize chochote kwa Kiswahili.`,
  },
  reportStart: {
    ENGLISH: `🚨 *SalamaWatch — Report Fraud*\n\nWhat type of fraud did you experience?\n\n1 - Phishing (fake SMS/call/email)\n2 - SIM Swap\n3 - M-Pesa fraud\n4 - Fake loan app\n5 - Account takeover\n6 - Other\n\nType the number:`,
    SWAHILI: `🚨 *SalamaWatch — Ripoti Udanganyifu*\n\nUlipata aina gani ya udanganyifu?\n\n1 - Udanganyifu wa SMS/simu bandia\n2 - SIM Swap\n3 - Udanganyifu wa M-Pesa\n4 - Programu ya mkopo bandia\n5 - Utekaji wa akaunti\n6 - Nyingine\n\nAndika nambari:`,
  },
  reportArea: {
    ENGLISH: `📍 Which area did this happen in? (e.g. Eastleigh, Kawangware, Kibera, Westlands...)`,
    SWAHILI: `📍 Hii ilitokea eneo gani? (mfano: Eastleigh, Kawangware, Kibera, Westlands...)`,
  },
  reportDesc: {
    ENGLISH: `📝 Briefly describe what happened. Include any phone numbers, amounts, or details that could help warn others:`,
    SWAHILI: `📝 Elezea kwa ufupi kilichotokea. Jumuisha nambari za simu, kiasi au maelezo yoyote yanayoweza kusaidia:`,
  },
  reportSaved: {
    ENGLISH: `✅ *Report received!* Thank you for protecting your community.\n\nYour report has been added to *ThreatRadar*. If verified, a *SalamaAlert* will be sent to members in that area.\n\nType *menu* to return to the main menu.`,
    SWAHILI: `✅ *Ripoti imepokelewa!* Asante kwa kulinda jamii yako.\n\nRipoti yako imeongezwa kwenye *ThreatRadar*. Ikiwa itathibitishwa, *SalamaAlert* itatumwa kwa wanachama wa eneo hilo.\n\nAndika *menyu* kurudi kwenye menyu kuu.`,
  },
  unknown: {
    ENGLISH: `🤔 I didn't understand that. Type *menu* to see what I can help you with, or ask a question in plain English.`,
    SWAHILI: `🤔 Sielewi hiyo. Andika *menyu* kuona ninachoweza kukusaidia, au uliza swali kwa Kiswahili.`,
  },
  langSet: {
    ENGLISH: `✅ Language set to *English*.\n\n`,
    SWAHILI: `✅ Lugha imewekwa kuwa *Kiswahili*.\n\n`,
  },
}

// Daily tip pool (in production: fetch from DB)
const dailyTips = {
  ENGLISH: [
    `🔐 *Tip of the Day: Protect Your M-Pesa PIN*\n\nYour M-Pesa PIN should never be your birth year, ID number, or phone digits. Change it every 3 months using *234*1#. Safaricom will *never* ask for your PIN via call or SMS.`,
    `📵 *Tip of the Day: SIM Swap Warning Signs*\n\nIf your phone suddenly loses signal and you can't make calls or receive SMS, call your telecom immediately from another phone. This could be a SIM swap attack in progress.`,
    `🔒 *Tip of the Day: Enable WhatsApp 2FA*\n\nSettings → Account → Two-step verification → Enable. This 6-digit PIN prevents anyone from setting up your WhatsApp on a new phone, even if they steal your SIM.`,
    `🌐 *Tip of the Day: Avoid Public Wi-Fi for Banking*\n\nNever do M-Pesa transactions or banking on public Wi-Fi (hotels, buses, malls). Use your mobile data. If you must use public Wi-Fi, enable a free VPN like Proton VPN first.`,
    `📧 *Tip of the Day: Spot Fake SMS*\n\nReal banks and Safaricom never:\n• Ask for your PIN via SMS\n• Send urgent "account suspended" threats\n• Include short bit.ly links\nIf you see these signs, it's a scam. Report it to us.`,
  ],
  SWAHILI: [
    `🔐 *Kidokezo cha Leo: Linda PIN yako ya M-Pesa*\n\nPIN yako ya M-Pesa isiwe mwaka wa kuzaliwa, nambari ya kitambulisho, au nambari ya simu. Ibadilishe kila miezi 3 ukitumia *234*1#. Safaricom haulizi kamwe PIN yako kwa simu au SMS.`,
    `📵 *Kidokezo cha Leo: Dalili za SIM Swap*\n\nIkiwa simu yako ghafla inapoteza mtandao na huwezi kupiga wala kupokea simu, piga simu mtoa huduma wako mara moja kwa simu nyingine. Hii inaweza kuwa shambulio la SIM swap.`,
    `🔒 *Kidokezo cha Leo: Wezesha WhatsApp 2FA*\n\nMipangilio → Akaunti → Uthibitishaji wa hatua mbili → Wezesha. PIN hii ya tarakimu 6 inazuia mtu yeyote kuweka WhatsApp yako kwenye simu mpya, hata wakiba SIM yako.`,
    `🌐 *Kidokezo cha Leo: Epuka Wi-Fi ya Umma kwa Benki*\n\nUsifanye shughuli za M-Pesa au benki kwenye Wi-Fi ya umma. Tumia data yako ya simu. Ukilazimika, wezesha VPN ya bure kama Proton VPN kwanza.`,
    `📧 *Kidokezo cha Leo: Tambua SMS Bandia*\n\nBenki halisi na Safaricom hawafanyi kamwe:\n• Kuomba PIN yako kwa SMS\n• Kutuma vitisho vya "akaunti imesimamishwa"\n• Kutuma viungo vya bit.ly\nUkiona hizi, ni udanganyifu. Turipotie.`,
  ],
}

// Active alerts (in production: fetch from DB)
async function getActiveAlerts(lang: string): Promise<string> {
  // In production: prisma.alert.findMany({ where: { active: true } })
  const en = `🚨 *Active SalamaAlerts*\n\n⚠️ *CRITICAL — Eastleigh & Mathare*\nSIM swap wave detected. Contact your telecom NOW to lock your SIM.\n\n⚠️ *HIGH — Nairobi-wide*\nFake KCB loan SMS circulating. DO NOT click any links.\n\n⚠️ *MEDIUM — Kawangware*\nFake Safaricom agents visiting homes. Do not share any info.\n\nFor full details visit: cybersalama.co.ke/alerts`
  const sw = `🚨 *Tahadhari za SalamaAlert*\n\n⚠️ *MUHIMU — Eastleigh na Mathare*\nWimbi la SIM swap limegunduliwa. Wasiliana na mtoa huduma wako SASA kufunga SIM yako.\n\n⚠️ *JUKUMU KUBWA — Nairobi nzima*\nSMS bandia za mkopo wa KCB zinasambazwa. USIBONYEZE viungo vyovyote.\n\n⚠️ *WASTANI — Kawangware*\nMawakala bandia wa Safaricom wanatembelea nyumba. Usitoe habari yoyote.\n\nKwa maelezo kamili tembelea: cybersalama.co.ke/alerts`
  return lang === 'SWAHILI' ? sw : en
}

// ─── AI-POWERED FREE QUESTION (fallback) ─────────────────────────
async function answerFreeQuestion(question: string, lang: string): Promise<string> {
  try {
    const sysPrompt = `You are SalamaBot, a cybersecurity assistant for communities in Nairobi, Kenya.
You specialize in: M-Pesa fraud, SIM swap, phishing, account security, social media safety.
Answer questions concisely (max 200 words). Use bullet points where helpful.
Always respond in ${lang === 'SWAHILI' ? 'Kiswahili' : 'simple English'}.
Start with a relevant emoji. End with: "Visit cybersalama.co.ke for more tips."`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: sysPrompt,
        messages: [{ role: 'user', content: question }],
      }),
    })
    const data = await res.json()
    return data.content?.[0]?.text ?? t.unknown[lang === 'SWAHILI' ? 'SWAHILI' : 'ENGLISH']
  } catch {
    return t.unknown[lang === 'SWAHILI' ? 'SWAHILI' : 'ENGLISH']
  }
}

// ─── THREAT TYPE MAP ──────────────────────────────────────────────
const reportTypeMap: Record<string, string> = {
  '1': 'PHISHING',
  '2': 'SIM_SWAP',
  '3': 'MPESA_FRAUD',
  '4': 'FAKE_LOAN',
  '5': 'ACCOUNT_TAKEOVER',
  '6': 'OTHER',
}

// ─── MAIN BOT HANDLER ─────────────────────────────────────────────
export async function handleBotMessage({ phone, message, session }: BotInput): Promise<BotOutput> {
  const msg  = message.trim().toLowerCase()
  const lang = session.language
  const L    = lang === 'SWAHILI' ? 'SWAHILI' : 'ENGLISH'
  const ctx  = (session.context as Record<string, string>) ?? {}

  // ── IDLE: show greeting ────────────────────────────────────────
  if (session.state === 'IDLE' || msg === 'hi' || msg === 'hello' || msg === 'habari' || msg === 'hujambo') {
    return { reply: t.welcome.ENGLISH, newState: 'LANG_SELECT' }
  }

  // ── LANGUAGE SELECTION ─────────────────────────────────────────
  if (session.state === 'LANG_SELECT') {
    if (msg === '1' || msg === 'english') {
      return { reply: t.langSet.ENGLISH + t.menu.ENGLISH, newState: 'MENU', newLanguage: 'ENGLISH' }
    }
    if (msg === '2' || msg === 'kiswahili' || msg === 'swahili') {
      return { reply: t.langSet.SWAHILI + t.menu.SWAHILI, newState: 'MENU', newLanguage: 'SWAHILI' }
    }
    return { reply: t.welcome.ENGLISH, newState: 'LANG_SELECT' }
  }

  // ── GLOBAL SHORTCUTS ──────────────────────────────────────────
  if (msg === 'menu' || msg === 'menyu' || msg === '0') {
    return { reply: t.menu[L], newState: 'MENU' }
  }

  // ── REPORT FLOW ───────────────────────────────────────────────
  if (session.state === 'REPORT_TYPE') {
    const type = reportTypeMap[msg]
    if (!type) return { reply: t.reportStart[L], newState: 'REPORT_TYPE' }
    await prisma.botSession.update({ where: { phone }, data: { context: { ...ctx, reportType: type } } })
    return { reply: t.reportArea[L], newState: 'REPORT_AREA' }
  }

  if (session.state === 'REPORT_AREA') {
    await prisma.botSession.update({ where: { phone }, data: { context: { ...ctx, reportArea: message.trim() } } })
    return { reply: t.reportDesc[L], newState: 'REPORT_DESC' }
  }

  if (session.state === 'REPORT_DESC') {
    // Save report to DB
    try {
      await prisma.fraudReport.create({
        data: {
          type: (ctx.reportType ?? 'OTHER') as any,
          title: `WhatsApp report from ${phone.slice(-4)} — ${ctx.reportType ?? 'OTHER'}`,
          description: message.trim(),
          area: ctx.reportArea ?? 'Unknown',
          severity: 'MEDIUM',
          source: 'WHATSAPP',
          status: 'PENDING',
        },
      })
    } catch (e) {
      console.error('Failed to save report:', e)
    }
    // Clear context
    await prisma.botSession.update({ where: { phone }, data: { context: {} } })
    return { reply: t.reportSaved[L], newState: 'MENU' }
  }

  // ── MENU CHOICES ──────────────────────────────────────────────
  if (session.state === 'MENU' || session.state === 'IDLE') {
    // 1 - Daily tip
    if (msg === '1') {
      const tips  = dailyTips[L]
      const tip   = tips[new Date().getDay() % tips.length]
      return { reply: tip + `\n\nType *menu* to go back.`, newState: 'MENU' }
    }
    // 2 - Alerts
    if (msg === '2') {
      const alerts = await getActiveAlerts(lang)
      return { reply: alerts + `\n\nType *menu* to go back.`, newState: 'MENU' }
    }
    // 3 - Report
    if (msg === '3') {
      return { reply: t.reportStart[L], newState: 'REPORT_TYPE' }
    }
    // 4 - Quiz (simplified bot quiz)
    if (msg === '4') {
      const reply = L === 'SWAHILI'
        ? `🧠 Jaribio la haraka:\n\nSafaricom anakupigia simu na kuomba PIN yako ya M-Pesa. Unafanya nini?\n\nA - Mtoa PIN yako\nB - Kata simu — ni ulaghai\nC - Mtoa nusu ya PIN\n\nJibu na A, B, au C:`
        : `🧠 Quick quiz:\n\nSomeone claiming to be Safaricom calls and asks for your M-Pesa PIN. What do you do?\n\nA - Give them your PIN\nB - Hang up — it's a scam\nC - Give only the first 2 digits\n\nReply A, B, or C:`
      return { reply, newState: 'QUIZ_Q1' }
    }
    // 5 - Free question
    if (msg === '5') {
      const prompt = L === 'SWAHILI'
        ? `💬 Niambie swali lako la usalama wa mtandao:`
        : `💬 Ask me your cybersecurity question:`
      return { reply: prompt, newState: 'FREE_QUESTION' }
    }
  }

  // ── QUIZ ANSWER ───────────────────────────────────────────────
  if (session.state === 'QUIZ_Q1') {
    const correct = msg === 'b'
    const reply = correct
      ? (L === 'SWAHILI'
          ? `✅ *Sahihi!* Unapaswa kukata simu mara moja. Safaricom hawaulizi kamwe PIN yako kwa simu.\n\nUmepata +10 pointi! 🎉\n\nType *menu* kurudi.`
          : `✅ *Correct!* You should hang up immediately. Safaricom will NEVER ask for your PIN over the phone.\n\nYou earned +10 points! 🎉\n\nType *menu* to go back.`)
      : (L === 'SWAHILI'
          ? `❌ *Jibu sahihi ni B* — Kata simu. Safaricom hawaulizi PIN yako kwa simu kamwe. Daima kata simu na ripoti nambari hiyo.\n\nType *menu* kurudi.`
          : `❌ *Correct answer is B* — Hang up. Safaricom never asks for your PIN over the phone. Always hang up and report that number.\n\nType *menu* to go back.`)
    return { reply, newState: 'MENU' }
  }

  // ── FREE QUESTION ─────────────────────────────────────────────
  if (session.state === 'FREE_QUESTION') {
    const answer = await answerFreeQuestion(message, lang)
    return { reply: answer + `\n\nType *menu* to go back.`, newState: 'MENU' }
  }

  // ── FALLBACK: try to answer as free question ──────────────────
  if (msg.length > 8 && (msg.includes('?') || msg.includes('how') || msg.includes('what') || msg.includes('jinsi') || msg.includes('nini'))) {
    const answer = await answerFreeQuestion(message, lang)
    return { reply: answer + `\n\nType *menu* for more options.`, newState: 'MENU' }
  }

  return { reply: t.unknown[L], newState: session.state }
}
