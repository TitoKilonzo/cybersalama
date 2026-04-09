import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding CyberSalama database...')

  // ── Admin user ─────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@Salama2025', 12)
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@cybersalama.co.ke' },
    update: {},
    create: {
      name:         'CyberSalama Admin',
      email:        'admin@cybersalama.co.ke',
      passwordHash: adminHash,
      role:         'ADMIN',
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ── Tips ────────────────────────────────────────────────────────
  const tipsData = [
    {
      titleEn: 'How to Enable M-Pesa PIN Lock',
      titleSw: 'Jinsi ya Kuwasha Kufuli ya PIN ya M-Pesa',
      bodyEn: 'Your M-Pesa PIN is your first line of defence. Use a unique 4-digit PIN that is not your birth year, phone number, or ID number. Change it every 3 months using *234*1#. Never share it with anyone.',
      bodySw: 'PIN yako ya M-Pesa ni ulinzi wako wa kwanza. Tumia nambari 4 za kipekee. Ibadilishe kila miezi 3 ukitumia *234*1#. Usimwambie mtu yeyote.',
      category: 'MPESA_SAFETY' as const,
      difficulty: 'BEGINNER' as const,
      tags: ['M-Pesa', 'PIN', 'safety'],
    },
    {
      titleEn: 'Spotting a Fake Bank or Safaricom SMS',
      titleSw: 'Kutambua SMS Bandia ya Benki au Safaricom',
      bodyEn: 'Red flags in fraudulent SMS: urgent language, suspicious short links, misspelled sender names, requests for your PIN. Real banks and Safaricom never ask for your PIN via SMS.',
      bodySw: 'Alama za onyo katika SMS za udanganyifu: lugha ya dharura, viungo vya kutiliwa shaka, maombi ya PIN. Benki na Safaricom hawaulizi PIN yako kwa SMS.',
      category: 'PHISHING' as const,
      difficulty: 'BEGINNER' as const,
      tags: ['SMS', 'phishing', 'bank fraud'],
    },
    {
      titleEn: 'Securing Your WhatsApp with 2FA',
      titleSw: 'Kulinda WhatsApp Yako na 2FA',
      bodyEn: 'Enable two-step verification: Settings → Account → Two-step verification → Enable. This 6-digit PIN prevents account takeover even if someone has your SIM.',
      bodySw: 'Wezesha uthibitishaji wa hatua mbili: Mipangilio → Akaunti → Uthibitishaji wa hatua mbili → Wezesha. PIN hii ya tarakimu 6 inazuia utekaji wa akaunti.',
      category: 'ACCOUNT_SECURITY' as const,
      difficulty: 'INTERMEDIATE' as const,
      tags: ['WhatsApp', '2FA', 'security'],
    },
    {
      titleEn: 'What is SIM Swap Fraud',
      titleSw: 'SIM Swap ni Nini',
      bodyEn: 'SIM swap fraud happens when criminals convince your telecom to transfer your number to a SIM they control. Immediate sign: sudden loss of signal. Call your telecom immediately if this happens.',
      bodySw: 'Udanganyifu wa SIM swap hutokea wakati wahalifu wanamshawishi mtoa huduma kuhamisha nambari yako. Dalili: kupoteza mtandao ghafla. Piga simu mtoa huduma mara moja.',
      category: 'SIM_SWAP' as const,
      difficulty: 'INTERMEDIATE' as const,
      tags: ['SIM swap', 'OTP', 'prevention'],
    },
    {
      titleEn: 'Creating Strong Passwords',
      titleSw: 'Kuunda Nywila Zenye Nguvu',
      bodyEn: 'A strong password: 12+ characters, mix of uppercase, lowercase, numbers and symbols. Never use your name or birthday. Use a different password for every account. Try Bitwarden (free) to manage them.',
      bodySw: 'Nywila yenye nguvu: herufi 12+, mchanganyiko wa herufi kubwa, ndogo, nambari na alama. Usitumie jina lako. Tumia nywila tofauti kwa kila akaunti.',
      category: 'PASSWORDS' as const,
      difficulty: 'BEGINNER' as const,
      tags: ['passwords', 'security', 'basics'],
    },
    {
      titleEn: 'Staying Safe on Public Wi-Fi',
      titleSw: 'Kuwa Salama kwenye Wi-Fi ya Umma',
      bodyEn: 'Never do banking or M-Pesa on public Wi-Fi. Use mobile data for financial transactions. If you must use public Wi-Fi, enable a free VPN like Proton VPN first.',
      bodySw: 'Usifanye shughuli za benki au M-Pesa kwenye Wi-Fi ya umma. Tumia data ya simu. Ukilazimika, wezesha VPN ya bure kama Proton VPN kwanza.',
      category: 'PUBLIC_WIFI' as const,
      difficulty: 'BEGINNER' as const,
      tags: ['Wi-Fi', 'VPN', 'mobile data'],
    },
  ]

  for (const tip of tipsData) {
    await prisma.tip.upsert({
      where:  { id: tip.titleEn.slice(0, 20).replace(/\s/g, '_') },
      update: {},
      create: { ...tip, id: tip.titleEn.slice(0, 20).replace(/\s/g, '_') },
    })
  }
  console.log(`✅ ${tipsData.length} tips seeded`)

  // ── Badges ─────────────────────────────────────────────────────
  const badges = [
    { name: 'First Shield',      description: 'Complete your first quiz',                  icon: '🛡️',  pointsReq: 0   },
    { name: 'SIM Defender',      description: 'Read all SIM Swap tips',                    icon: '📱',  pointsReq: 20  },
    { name: 'Phish Spotter',     description: 'Score 100% on Phishing quiz',               icon: '🎣',  pointsReq: 30  },
    { name: 'Community Guardian',description: 'Submit 5 verified fraud reports',           icon: '👁️',  pointsReq: 50  },
    { name: 'SalamaChampion',    description: 'Complete all quizzes with passing scores',  icon: '🏆',  pointsReq: 100 },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where:  { id: badge.name.replace(/\s/g, '_') },
      update: {},
      create: { ...badge, id: badge.name.replace(/\s/g, '_') },
    })
  }
  console.log(`✅ ${badges.length} badges seeded`)

  // ── Sample alert ───────────────────────────────────────────────
  await prisma.alert.create({
    data: {
      titleEn:  'Active SIM Swap Wave — Eastleigh',
      titleSw:  'Wimbi la SIM Swap — Eastleigh',
      bodyEn:   'Multiple verified SIM swap reports in Eastleigh. Contact your telecom NOW to lock your SIM.',
      bodySw:   'Ripoti nyingi za SIM swap Eastleigh. Wasiliana na mtoa huduma wako SASA kufunga SIM yako.',
      area:     'Eastleigh',
      severity: 'CRITICAL',
      active:   true,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
  })
  console.log('✅ Sample alert seeded')

  console.log('\n🎉 CyberSalama seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
