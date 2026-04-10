'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin, BookOpen, AlertTriangle, Zap, Bell,
  Users, Shield, ChevronRight, ArrowUpRight,
  MessageSquare, ExternalLink, TrendingUp
} from 'lucide-react'

const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.07 }}}
const fadeUp  = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0,transition:{duration:0.4}}}

const stats = [
  { label:'Active Threats',   value:'7',   delta:'+2 today',   icon:AlertTriangle, color:'#ef4444', bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.2)',   href:'/dashboard/threats' },
  { label:'Tips Published',   value:'128', delta:'+3 this wk', icon:BookOpen,      color:'#14b8a6', bg:'rgba(20,184,166,0.1)', border:'rgba(20,184,166,0.2)', href:'/dashboard/learn' },
  { label:'Reports Filed',    value:'43',  delta:'+6 this wk', icon:Users,         color:'#14b374', bg:'rgba(20,179,116,0.1)', border:'rgba(20,179,116,0.2)', href:'/dashboard/report' },
  { label:'Alerts Broadcast', value:'12',  delta:'Last 30d',   icon:Bell,          color:'#a78bfa', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.2)', href:'/dashboard/alerts' },
]

const recentThreats = [
  { type:'SIM_SWAP',    area:'Eastleigh',  severity:'HIGH',     time:'2h ago',  desc:'SIM-swap reports near Safaricom outlets, Section 3.', verified:true },
  { type:'PHISHING',    area:'Kawangware', severity:'MEDIUM',   time:'4h ago',  desc:'Fake KCB loan approval SMS with malicious link circulating.', verified:false },
  { type:'MPESA_FRAUD', area:'Uthiru',     severity:'HIGH',     time:'6h ago',  desc:'Fake Safaricom agents calling for M-Pesa PINs.', verified:true },
  { type:'FAKE_LOAN',   area:'Kibera',     severity:'CRITICAL', time:'1d ago',  desc:'"KwikCash" app collecting ID data without disbursing loans.', verified:true },
]

const sevStyle: Record<string,string> = { CRITICAL:'badge-critical', HIGH:'badge-high', MEDIUM:'badge-medium', LOW:'badge-low' }
const typeLabel: Record<string,string> = { SIM_SWAP:'SIM Swap', PHISHING:'Phishing', MPESA_FRAUD:'M-Pesa Fraud', FAKE_LOAN:'Fake Loan' }

const quickActions = [
  { href:'/dashboard/quiz',    icon:Zap,           label:'Take a Quiz',    color:'text-yellow-400' },
  { href:'/dashboard/report',  icon:AlertTriangle, label:'Report a Scam',  color:'text-amber-400' },
  { href:'/dashboard/threats', icon:MapPin,        label:'Open Threat Map', color:'text-red-400' },
  { href:'https://wa.me/254700000000?text=Hi', icon:MessageSquare, label:'Chat SalamaBot', color:'text-salama-400', ext:true },
]

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-white mb-0.5">Good day 👋</h1>
          <p className="text-slate-500 text-sm">Here's what's happening across Nairobi right now.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/report" className="btn-ghost py-2 px-3 sm:px-4 text-xs gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Report Fraud</span>
          </Link>
          <Link href="/dashboard/threats" className="btn-primary py-2 px-3 sm:px-4 text-xs gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Threat Map</span>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(s => (
          <motion.div key={s.label} variants={fadeUp}>
            <Link href={s.href} className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-0.5"
              style={{background:`rgba(8,14,28,0.7)`,border:`1px solid ${s.border}`,backdropFilter:'blur(12px)'}}>
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{background:s.bg,border:`1px solid ${s.border}`}}>
                  <s.icon className="w-4 h-4" style={{color:s.color}} />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition-colors" />
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl" style={{color:s.color}}>{s.value}</div>
                <div className="text-white text-xs sm:text-sm font-medium mt-0.5">{s.label}</div>
                <div className="text-slate-700 text-xs mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />{s.delta}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Threats feed */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{background:'rgba(8,14,28,0.7)',border:'1px solid rgba(20,179,116,0.1)',backdropFilter:'blur(12px)'}}>
          <div className="flex items-center justify-between px-4 sm:px-5 py-4"
            style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.2)'}}>
                <MapPin className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span className="font-display font-semibold text-sm text-white">ThreatRadar</span>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>
            <Link href="/dashboard/threats" className="flex items-center gap-1 text-xs text-salama-400 hover:text-salama-300 transition-colors">
              Live map <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{borderColor:'rgba(255,255,255,0.04)'}}>
            {recentThreats.map((t,i) => (
              <Link key={i} href="/dashboard/threats"
                className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-white/3 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="threat-chip text-xs">{typeLabel[t.type]??t.type}</span>
                    <span className="text-xs text-slate-500">{t.area}</span>
                    {t.verified && <span className="text-[10px] text-salama-500 font-semibold">✓</span>}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-1 sm:line-clamp-2">{t.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={sevStyle[t.severity]}>{t.severity}</span>
                  <span className="text-[10px] text-slate-700 whitespace-nowrap">{t.time}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-4 sm:px-5 py-3" style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
            <Link href="/dashboard/threats" className="text-xs text-slate-600 hover:text-salama-400 transition-colors flex items-center gap-1">
              Open full ThreatRadar <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Safety score */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            className="p-5 rounded-2xl"
            style={{background:'rgba(8,14,28,0.7)',border:'1px solid rgba(20,179,116,0.15)',backdropFilter:'blur(12px)'}}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-salama-400" />
                <span className="font-display font-semibold text-sm text-white">Safety Score</span>
              </div>
              <Link href="/dashboard/quiz" className="text-xs text-salama-400 hover:text-salama-300">Improve</Link>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="font-display font-extrabold text-5xl text-gradient-green leading-none">72</span>
              <span className="text-slate-600 text-xl mb-1">/100</span>
            </div>
            <div className="w-full rounded-full h-1.5 mb-2" style={{background:'rgba(255,255,255,0.06)'}}>
              <motion.div initial={{width:0}} animate={{width:'72%'}} transition={{delay:0.7,duration:0.8,ease:'easeOut'}}
                className="h-1.5 rounded-full" style={{background:'linear-gradient(90deg,#14b374,#2dd4bf)',boxShadow:'0 0 8px rgba(20,179,116,0.4)'}} />
            </div>
            <p className="text-xs text-slate-700">Complete quizzes to raise your score</p>
          </motion.div>

          {/* Quick actions */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
            className="p-4 rounded-2xl"
            style={{background:'rgba(8,14,28,0.7)',border:'1px solid rgba(20,179,116,0.1)',backdropFilter:'blur(12px)'}}>
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="space-y-1">
              {quickActions.map(a => (
                <Link key={a.href} href={a.href}
                  target={a.ext?'_blank':undefined} rel={a.ext?'noopener noreferrer':undefined}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <a.icon className={`w-4 h-4 flex-shrink-0 ${a.color}`} />
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors flex-1">{a.label}</span>
                  {a.ext
                    ? <ExternalLink className="w-3 h-3 text-slate-700" />
                    : <ChevronRight className="w-3 h-3 text-slate-800 group-hover:text-slate-600 transition-colors" />}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Active alert */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
            <Link href="/dashboard/alerts"
              className="flex items-start gap-3 p-4 rounded-2xl transition-all hover:border-red-500/30 group"
              style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.18)',backdropFilter:'blur(12px)'}}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-red-400">CRITICAL ALERT</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  SIM swap wave in Eastleigh & Mathare. Contact your telecom now.
                </p>
                <p className="text-[10px] text-slate-700 mt-1.5 group-hover:text-salama-500 transition-colors">View all alerts →</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
