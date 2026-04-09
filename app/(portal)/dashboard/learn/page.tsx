'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Lock, Smartphone, Wifi, Eye, Shield, Globe, MessageSquare, ChevronDown, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { id:'ALL',              label:'All Tips',         icon:BookOpen     },
  { id:'MPESA_SAFETY',     label:'M-Pesa Safety',    icon:Smartphone   },
  { id:'PHISHING',         label:'Phishing',         icon:Eye          },
  { id:'PASSWORDS',        label:'Passwords',        icon:Lock         },
  { id:'PUBLIC_WIFI',      label:'Public Wi-Fi',     icon:Wifi         },
  { id:'ACCOUNT_SECURITY', label:'Account Security', icon:Shield       },
  { id:'SIM_SWAP',         label:'SIM Swap',         icon:Smartphone   },
  { id:'SCAM_AWARENESS',   label:'Scam Awareness',   icon:Eye          },
  { id:'SAFE_BROWSING',    label:'Safe Browsing',    icon:Globe        },
  { id:'SOCIAL_MEDIA',     label:'Social Media',     icon:MessageSquare},
]

const tips = [
  { id:'1', category:'MPESA_SAFETY', difficulty:'BEGINNER', titleEn:'How to Enable M-Pesa PIN Lock', titleSw:'Jinsi ya Kuwasha Kufuli ya PIN ya M-Pesa',
    bodyEn:'Your M-Pesa PIN is your first line of defence. Use a unique 4-digit PIN that is not your birth year, phone number, or ID number. Change it every 3 months using *234*1#. Never share it with anyone — not even callers claiming to be Safaricom. Enable the PIN lock feature by dialling *234# and selecting Security.',
    bodySw:'PIN yako ya M-Pesa ni ulinzi wako wa kwanza. Tumia nambari 4 za kipekee ambazo si mwaka wa kuzaliwa wako, nambari ya simu, au kitambulisho. Ibadilishe kila miezi 3 ukitumia *234*1#. Usimwambie mtu yeyote — hata wanaosema ni Safaricom.',
    tags:['M-Pesa','PIN','safety'], views:312 },
  { id:'2', category:'PHISHING', difficulty:'BEGINNER', titleEn:'Spotting a Fake Bank or Safaricom SMS', titleSw:'Kutambua SMS Bandia ya Benki au Safaricom',
    bodyEn:'Fraudulent SMS messages look real but have red flags: urgent language ("Your account will be suspended!"), suspicious short links (bit.ly/xxx), misspelled sender names, and requests for your PIN or password. Real banks and Safaricom never ask for your PIN via SMS. When in doubt, call the official number on the company website — never the number in the SMS.',
    bodySw:'SMS za udanganyifu zinaonekana halisi lakini zina alama za onyo: lugha ya dharura, viungo vya kutiliwa shaka, majina mabaya ya mtumaji, na maombi ya PIN yako. Benki halisi na Safaricom hawaulizi PIN yako kwa SMS. Ukishuku, piga simu nambari rasmi kwenye tovuti ya kampuni.',
    tags:['SMS','phishing','bank fraud'], views:289 },
  { id:'3', category:'ACCOUNT_SECURITY', difficulty:'INTERMEDIATE', titleEn:'Securing Your WhatsApp Account with 2FA', titleSw:'Kulinda Akaunti Yako ya WhatsApp na 2FA',
    bodyEn:'Two-factor authentication (2FA) adds a 6-digit PIN to your WhatsApp. Even if someone steals your SIM, they cannot access your WhatsApp without this PIN. Enable it: Settings → Account → Two-step verification → Enable. Store your recovery email safely. Never share this 2FA code with anyone.',
    bodySw:'Uthibitishaji wa hatua mbili (2FA) unaongeza PIN ya nambari 6 kwenye WhatsApp yako. Hata mtu akiiba SIM yako, hataingia WhatsApp bila PIN hii. Iwezesha: Mipangilio → Akaunti → Uthibitishaji wa hatua mbili → Wezesha.',
    tags:['WhatsApp','2FA','security'], views:201 },
  { id:'4', category:'SIM_SWAP', difficulty:'INTERMEDIATE', titleEn:'What is SIM Swap Fraud and How to Prevent It', titleSw:'SIM Swap ni Nini na Jinsi ya Kujilinda',
    bodyEn:'SIM swap fraud happens when criminals convince your telecom to transfer your number to a SIM they control. They intercept your OTP codes and drain accounts. Signs: your phone suddenly loses signal. Actions: call your telecom immediately from another phone, set a SIM PIN (Settings → SIM card security), and enable account PINs on Safaricom via *100#.',
    bodySw:'SIM swap hutokea wakati wahalifu wamshawishi mtoa huduma kuhamisha nambari yako. Dalili: simu kupoteza mtandao ghafla. Hatua: piga simu mtoa huduma mara moja kwa simu nyingine, weka SIM PIN, na wezesha PIN ya akaunti kwa Safaricom kupitia *100#.',
    tags:['SIM swap','OTP','prevention'], views:178 },
  { id:'5', category:'PASSWORDS', difficulty:'BEGINNER', titleEn:'Creating Unbreakable Passwords', titleSw:'Kuunda Nywila Zisizovunjika',
    bodyEn:'A strong password is at least 12 characters with uppercase, lowercase, numbers, and symbols. Never use your name, "password123", phone number, or birthday. Use a different password for every account — if one leaks, others stay safe. Consider Bitwarden (free, open-source) to manage passwords across devices without remembering them all.',
    bodySw:'Nywila yenye nguvu ina angalau herufi 12 na mchanganyiko wa herufi kubwa, ndogo, nambari na alama. Usitumie jina lako. Tumia nywila tofauti kwa kila akaunti. Fikiria Bitwarden (bila malipo) kusimamia nywila zako.',
    tags:['passwords','security','basics'], views:156 },
  { id:'6', category:'PUBLIC_WIFI', difficulty:'BEGINNER', titleEn:'Staying Safe on Public Wi-Fi', titleSw:'Kuwa Salama kwenye Wi-Fi ya Umma',
    bodyEn:'Public Wi-Fi in malls, hotels, and matatus can be monitored by attackers using "man-in-the-middle" tools. Never access banking, M-Pesa, or personal email on public Wi-Fi. If you must, use a free VPN like Proton VPN — it encrypts all your traffic. Always prefer mobile data for financial transactions.',
    bodySw:'Wi-Fi ya umma inaweza kufuatiliwa na washambuliaji. Usifanye malipo ya benki au M-Pesa kwenye Wi-Fi ya umma. Tumia Proton VPN ya bure — inafunika trafiki yako yote. Tumia data ya simu kwa shughuli za kifedha.',
    tags:['Wi-Fi','VPN','mobile data'], views:134 },
  { id:'7', category:'SCAM_AWARENESS', difficulty:'BEGINNER', titleEn:'Recognising Fake Job Offers', titleSw:'Kutambua Ofa za Kazi Bandia',
    bodyEn:'Fake job scams target young Kenyans on WhatsApp and Facebook. Red flags: the job pays unusually high salaries for no qualifications, they ask for a "registration fee" upfront, the recruiter contacts you first, communication is via personal WhatsApp not official email, and there is no verifiable company address or website.',
    bodySw:'Udanganyifu wa kazi bandia unalenga vijana wa Kenya kwenye WhatsApp na Facebook. Alama za onyo: mshahara wa juu bila sifa, wanakuomba "ada ya usajili" mapema, mtaalamu anakuwasiliana nawe kwanza, na hakuna anwani ya kampuni inayoweza kuthibitishwa.',
    tags:['jobs','scam','social media'], views:112 },
  { id:'8', category:'SOCIAL_MEDIA', difficulty:'INTERMEDIATE', titleEn:'Locking Down Your Facebook Privacy', titleSw:'Kulinda Faragha ya Facebook Yako',
    bodyEn:'Over-sharing on Facebook helps scammers build profiles for targeted attacks. Actions: set profile to Friends only, remove your phone number from your profile, review apps connected to Facebook (Settings → Apps), enable login alerts (Settings → Security), and never accept friend requests from strangers.',
    bodySw:'Kushiriki mengi kwenye Facebook husaidia washambuliaji. Hatua: weka wasifu kwa Marafiki tu, ondoa nambari ya simu kwenye wasifu wako, angalia programu zilizounganishwa, na wezesha tahadhari za kuingia.',
    tags:['Facebook','privacy','social'], views:98 },
]

const diffColor: Record<string, string> = {
  BEGINNER:     'text-salama-400 bg-salama-500/10 border-salama-500/20',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  ADVANCED:     'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function SalamaLearnPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('ALL')
  const [lang,     setLang]     = useState<'en'|'sw'>('en')
  const [expanded, setExpanded] = useState<string|null>(null)

  const filtered = tips.filter(t => {
    const matchCat = category === 'ALL' || t.category === category
    const q = search.toLowerCase()
    return matchCat && (!q || t.titleEn.toLowerCase().includes(q) || t.titleSw.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)))
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/12 border border-cyan-500/20 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-cyan-400" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">SalamaLearn</h1>
          </div>
          <p className="text-slate-500 text-sm">Illustrated security guides — bilingual, structured for every level.</p>
        </div>
        <div className="flex items-center rounded-xl border border-white/8 overflow-hidden text-xs font-semibold">
          {(['en','sw'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-4 py-2.5 transition-colors ${lang === l ? 'bg-salama-500 text-ink-950' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              {l === 'en' ? 'English' : 'Kiswahili'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
        <input type="text" placeholder="Search tips, topics, keywords..."
          value={search} onChange={e => setSearch(e.target.value)} className="input-cyber pl-11" />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              category === c.id
                ? 'bg-salama-500/15 border-salama-500/35 text-salama-400'
                : 'border-white/7 text-slate-500 hover:border-white/15 hover:text-slate-300'
            }`}>
            <c.icon className="w-3.5 h-3.5" />{c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-600">{filtered.length} tip{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Tips */}
      <div className="space-y-2">
        {filtered.map(tip => {
          const isOpen = expanded === tip.id
          const title  = lang === 'en' ? tip.titleEn : tip.titleSw
          const body   = lang === 'en' ? tip.bodyEn  : tip.bodySw
          return (
            <motion.div key={tip.id} layout
              className={`glass rounded-2xl border overflow-hidden transition-all duration-200 ${isOpen ? 'border-salama-500/25' : 'border-white/6 hover:border-white/12'}`}>
              <button className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                onClick={() => setExpanded(isOpen ? null : tip.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${diffColor[tip.difficulty]}`}>
                      {tip.difficulty}
                    </span>
                    <span className="text-xs text-slate-600">{tip.category.replace(/_/g,' ')}</span>
                    <span className="text-xs text-slate-700 ml-auto">{tip.views} reads</span>
                  </div>
                  <h3 className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>{title}</h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tip.tags.map(tag => (
                      <span key={tag} className="text-xs text-slate-700 bg-white/4 px-2 py-0.5 rounded-lg">#{tag}</span>
                    ))}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-salama-400' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                    exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }}>
                    <div className="px-5 pb-5 border-t border-white/5">
                      <p className="text-sm text-slate-300 leading-relaxed mt-4">{body}</p>
                      <div className="flex items-center gap-3 mt-4">
                        <Link href="/dashboard/quiz"
                          className="inline-flex items-center gap-1.5 text-xs text-salama-400 hover:text-salama-300 font-medium transition-colors">
                          Test your knowledge <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No tips match your search. Try different keywords.</p>
          </div>
        )}
      </div>
    </div>
  )
}
