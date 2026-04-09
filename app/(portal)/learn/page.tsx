'use client'

import { useState } from 'react'
import { BookOpen, Search, Lock, Smartphone, Wifi, CreditCard, Eye, Shield, Globe, MessageSquare } from 'lucide-react'

const CATEGORIES = [
  { id: 'ALL',              label: 'All Tips',        icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'MPESA_SAFETY',     label: 'M-Pesa Safety',   icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'PHISHING',         label: 'Phishing',        icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'PASSWORDS',        label: 'Passwords',       icon: <Lock className="w-3.5 h-3.5" /> },
  { id: 'PUBLIC_WIFI',      label: 'Public Wi-Fi',    icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'ACCOUNT_SECURITY', label: 'Account Security',icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'SIM_SWAP',         label: 'SIM Swap',        icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'SCAM_AWARENESS',   label: 'Scam Awareness',  icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'SAFE_BROWSING',    label: 'Safe Browsing',   icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'SOCIAL_MEDIA',     label: 'Social Media',    icon: <MessageSquare className="w-3.5 h-3.5" /> },
]

const tips = [
  {
    id: '1', category: 'MPESA_SAFETY', difficulty: 'BEGINNER',
    titleEn: 'How to Enable M-Pesa PIN Lock',
    titleSw: 'Jinsi ya Kuwasha Kufuli ya PIN ya M-Pesa',
    bodyEn: 'Your M-Pesa PIN is your first line of defence. Use a unique 4-digit PIN that is not your birth year, phone number, or ID number. Change it every 3 months using *234*1#. Never share it with anyone — even "Safaricom agents" calling you.',
    bodySw: 'PIN yako ya M-Pesa ni ulinzi wako wa kwanza. Tumia nambari 4 za kipekee ambazo si mwaka wa kuzaliwa wako, nambari ya simu, au nambari ya kitambulisho. Ibadilishe kila miezi 3 ukitumia *234*1#. Usimwambie mtu yeyote.',
    tags: ['M-Pesa', 'PIN', 'safety'],
    views: 312,
  },
  {
    id: '2', category: 'PHISHING', difficulty: 'BEGINNER',
    titleEn: 'Spotting a Fake Bank or Safaricom SMS',
    titleSw: 'Kutambua SMS Bandia ya Benki au Safaricom',
    bodyEn: 'Fraudulent SMS messages look real but have red flags: urgent language ("Your account will be suspended!"), suspicious short links (bit.ly/xxx), misspelled sender names, and requests for your PIN or password. Real banks and Safaricom never ask for your PIN via SMS.',
    bodySw: 'SMS za udanganyifu zinaonekana halisi lakini zina alama za onyo: lugha ya dharura, viungo vya kutiliwa shaka, na maombi ya PIN yako. Benki halisi na Safaricom hawaulizi kamwe PIN yako kwa SMS.',
    tags: ['SMS', 'phishing', 'bank fraud'],
    views: 289,
  },
  {
    id: '3', category: 'ACCOUNT_SECURITY', difficulty: 'INTERMEDIATE',
    titleEn: 'Securing Your WhatsApp Account with 2FA',
    titleSw: 'Kulinda Akaunti Yako ya WhatsApp na 2FA',
    bodyEn: 'Two-factor authentication (2FA) adds a 6-digit PIN to your WhatsApp account. Even if someone steals your SIM, they cannot access your WhatsApp without this PIN. Enable it: Settings → Account → Two-step verification → Enable.',
    bodySw: 'Uthibitishaji wa hatua mbili (2FA) unaongeza PIN ya nambari 6 kwa akaunti yako ya WhatsApp. Hata kama mtu ataiba SIM yako, hataweza kuingia WhatsApp yako bila PIN hii. Iwezesha: Mipangilio → Akaunti → Uthibitishaji wa hatua mbili → Wezesha.',
    tags: ['WhatsApp', '2FA', 'security'],
    views: 201,
  },
  {
    id: '4', category: 'SIM_SWAP', difficulty: 'INTERMEDIATE',
    titleEn: 'What is SIM Swap Fraud and How to Prevent It',
    titleSw: 'SIM Swap ni Nini na Jinsi ya Kujilinda',
    bodyEn: 'SIM swap fraud happens when criminals convince your telecom to transfer your number to a SIM card they control. They then intercept your OTP codes and drain your accounts. Signs: your phone suddenly loses signal, you stop receiving calls or SMS. Immediately call your telecom if this happens.',
    bodySw: 'Udanganyifu wa SIM swap hutokea wakati wahalifu wanamshawishi mtoa huduma wako kuhamisha nambari yako kwenye SIM wanayodhibiti. Dalili: simu yako kupoteza mtandao ghafla. Piga simu mara moja mtoa huduma wako ukijua hili.',
    tags: ['SIM swap', 'OTP', 'prevention'],
    views: 178,
  },
  {
    id: '5', category: 'PASSWORDS', difficulty: 'BEGINNER',
    titleEn: 'Creating Unbreakable Passwords',
    titleSw: 'Kuunda Nywila Zisizovunjika',
    bodyEn: 'A strong password is at least 12 characters with uppercase, lowercase, numbers, and symbols. Never use your name, "password123", or your phone number. Use a different password for every account. Consider a password manager like Bitwarden (free) to manage them.',
    bodySw: 'Nywila yenye nguvu ina angalau herufi 12 na herufi kubwa, ndogo, nambari na alama. Usitumie jina lako au "password123". Tumia nywila tofauti kwa kila akaunti. Fikiria kutumia programu ya kusimamia nywila kama Bitwarden (bila malipo).',
    tags: ['passwords', 'security', 'basics'],
    views: 156,
  },
  {
    id: '6', category: 'PUBLIC_WIFI', difficulty: 'BEGINNER',
    titleEn: 'Staying Safe on Public Wi-Fi',
    titleSw: 'Kuwa Salama kwenye Wi-Fi ya Umma',
    bodyEn: 'Public Wi-Fi in malls, hotels, and buses can be monitored by attackers. Never access your bank account or M-Pesa on public Wi-Fi. If you must, use a VPN (Virtual Private Network). Prefer your mobile data for financial transactions.',
    bodySw: 'Wi-Fi ya umma katika madukani, hoteli na mabasi inaweza kufuatiliwa na washambuliaji. Usifanye malipo ya benki au M-Pesa kwenye Wi-Fi ya umma. Ukilazimika, tumia VPN. Tumia data yako ya simu kwa shughuli za kifedha.',
    tags: ['Wi-Fi', 'VPN', 'mobile data'],
    views: 134,
  },
]

const difficultyColor: Record<string, string> = {
  BEGINNER:     'text-salama-400 bg-salama-500/10 border-salama-500/20',
  INTERMEDIATE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  ADVANCED:     'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function SalamaLearnPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('ALL')
  const [lang,     setLang]     = useState<'en' | 'sw'>('en')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = tips.filter((t) => {
    const matchCat = category === 'ALL' || t.category === category
    const q = search.toLowerCase()
    const matchSearch = !q || t.titleEn.toLowerCase().includes(q) || t.titleSw.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q))
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-cyber-400" />
            <h1 className="font-display font-bold text-2xl text-white">SalamaLearn</h1>
          </div>
          <p className="text-ink-400 text-sm">Security guides — illustrated, bilingual, built for everyone</p>
        </div>
        {/* Language toggle */}
        <div className="flex items-center rounded-lg border border-ink-700 overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 transition-colors ${lang === 'en' ? 'bg-salama-500 text-ink-950' : 'text-ink-400 hover:text-white'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang('sw')}
            className={`px-4 py-2 transition-colors ${lang === 'sw' ? 'bg-salama-500 text-ink-950' : 'text-ink-400 hover:text-white'}`}
          >
            Kiswahili
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
        <input
          type="text"
          placeholder="Search tips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-cyber pl-10"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              category === c.id
                ? 'bg-salama-500/20 border-salama-500/40 text-salama-400'
                : 'border-ink-700 text-ink-400 hover:border-ink-600'
            }`}
          >
            {c.icon}{c.label}
          </button>
        ))}
      </div>

      {/* Tips grid */}
      <div className="text-xs text-ink-500">{filtered.length} tips found</div>
      <div className="space-y-3">
        {filtered.map((tip) => {
          const isOpen = expanded === tip.id
          const title  = lang === 'en' ? tip.titleEn : tip.titleSw
          const body   = lang === 'en' ? tip.bodyEn  : tip.bodySw
          return (
            <div
              key={tip.id}
              className={`glass rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-salama-500/30' : 'border-salama-500/10 hover:border-salama-500/25'
              }`}
            >
              <button
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                onClick={() => setExpanded(isOpen ? null : tip.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor[tip.difficulty]}`}>
                      {tip.difficulty}
                    </span>
                    <span className="text-xs text-ink-500">{tip.category.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-ink-700 ml-auto">{tip.views} views</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink-100 leading-snug">{title}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tip.tags.map((tag) => (
                      <span key={tag} className="text-xs text-ink-600 bg-ink-800 px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                </div>
                <span className={`text-ink-500 text-lg flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ›
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-ink-800/50">
                  <p className="text-sm text-ink-300 leading-relaxed mt-4">{body}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
