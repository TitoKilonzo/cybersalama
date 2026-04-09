'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin, BookOpen, AlertTriangle, Zap, Bell,
  TrendingUp, Users, Shield, ChevronRight, ArrowRight,
  ExternalLink, MessageSquare
} from 'lucide-react'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp  = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

const stats = [
  { label: 'Active Threats',    value: '7',   delta: '+2 today',    icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    href: '/dashboard/threats' },
  { label: 'Tips Published',    value: '128', delta: '+3 this week', icon: BookOpen,      color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   href: '/dashboard/learn' },
  { label: 'Community Reports', value: '43',  delta: '+6 this week', icon: Users,         color: 'text-salama-400', bg: 'bg-salama-500/10', border: 'border-salama-500/20', href: '/dashboard/report' },
  { label: 'Alerts Broadcast',  value: '12',  delta: 'Last 30 days', icon: Bell,          color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', href: '/dashboard/alerts' },
]

const recentThreats = [
  { type: 'SIM_SWAP',    area: 'Eastleigh',  severity: 'HIGH',     time: '2h ago',  desc: 'Multiple SIM-swap reports near Safaricom outlets in Eastleigh Section 3.', verified: true },
  { type: 'PHISHING',    area: 'Kawangware', severity: 'MEDIUM',   time: '4h ago',  desc: 'Fake KCB loan approval SMS with malicious link circulating widely.', verified: false },
  { type: 'MPESA_FRAUD', area: 'Uthiru',     severity: 'HIGH',     time: '6h ago',  desc: 'Impersonation calls from fake Safaricom agents requesting M-Pesa PINs.', verified: true },
  { type: 'FAKE_LOAN',   area: 'Kibera',     severity: 'CRITICAL', time: '1d ago',  desc: '"KwikCash" fraudulent loan app collecting ID data without disbursing.', verified: true },
]

const latestTips = [
  { title: 'How to Enable M-Pesa PIN Lock',          category: 'M-PESA SAFETY',     difficulty: 'BEGINNER',      color: 'text-salama-400' },
  { title: 'Spotting a Fake Bank or Safaricom SMS',  category: 'PHISHING',           difficulty: 'BEGINNER',      color: 'text-cyan-400'   },
  { title: 'Securing Your WhatsApp Account with 2FA',category: 'ACCOUNT SECURITY',   difficulty: 'INTERMEDIATE',  color: 'text-purple-400' },
]

const activeAlerts = [
  { title: 'SIM Swap Wave — Eastleigh & Mathare', severity: 'CRITICAL', time: '2h ago' },
  { title: 'Fake KCB Loan SMS Circulating',       severity: 'HIGH',     time: '5h ago' },
]

const severityStyle: Record<string, string> = {
  CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low',
}
const threatLabel: Record<string, string> = {
  SIM_SWAP: 'SIM Swap', PHISHING: 'Phishing', MPESA_FRAUD: 'M-Pesa Fraud', FAKE_LOAN: 'Fake Loan',
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Good day, Tito 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Here's what's happening across Nairobi right now.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/report" className="btn-ghost py-2 px-4 text-xs gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Report Fraud
          </Link>
          <Link href="/dashboard/threats" className="btn-primary py-2 px-4 text-xs gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> View Map
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <motion.div variants={stagger} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Link href={s.href} className={`stat-card border ${s.border} ${s.bg} flex flex-col gap-3 group`}>
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg} border ${s.border}`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <ArrowRight className={`w-4 h-4 text-slate-700 group-hover:${s.color} group-hover:translate-x-0.5 transition-all`} />
              </div>
              <div>
                <div className={`font-display font-extrabold text-3xl ${s.color}`}>{s.value}</div>
                <div className="text-white text-sm font-medium mt-0.5">{s.label}</div>
                <div className="text-slate-600 text-xs mt-1">{s.delta}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent threats */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          className="lg:col-span-2 glass rounded-2xl border border-salama-500/12 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/12 border border-red-500/20 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span className="font-display font-semibold text-sm">ThreatRadar — Recent</span>
            </div>
            <Link href="/dashboard/threats"
              className="text-xs text-salama-400 hover:text-salama-300 transition-colors flex items-center gap-1">
              View live map <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/4">
            {recentThreats.map((t, i) => (
              <Link key={i} href="/dashboard/threats"
                className="flex items-start gap-4 px-5 py-4 hover:bg-white/3 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="threat-chip">{threatLabel[t.type] ?? t.type}</span>
                    <span className="text-xs text-slate-500">{t.area}</span>
                    {t.verified && <span className="text-xs text-salama-500 font-medium">✓ Verified</span>}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{t.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={severityStyle[t.severity]}>{t.severity}</span>
                  <span className="text-xs text-slate-700">{t.time}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-white/5">
            <Link href="/dashboard/threats"
              className="text-xs text-slate-500 hover:text-salama-400 transition-colors flex items-center gap-1">
              Open full ThreatRadar map <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Active alerts */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="glass rounded-2xl border border-red-500/15 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="font-display font-semibold text-sm text-red-400">SalamaAlert</span>
              </div>
              <Link href="/dashboard/alerts" className="text-xs text-slate-500 hover:text-red-400 transition-colors">
                All <ChevronRight className="w-3 h-3 inline" />
              </Link>
            </div>
            <div className="p-2 space-y-1">
              {activeAlerts.map((a, i) => (
                <Link key={i} href="/dashboard/alerts"
                  className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors">
                  <span className={severityStyle[a.severity]}>{a.severity}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-snug line-clamp-2">{a.title}</p>
                    <p className="text-xs text-slate-700 mt-0.5">{a.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Safety score */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
            className="glass rounded-2xl border border-salama-500/15 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-salama-400" />
                <span className="font-display font-semibold text-sm">Your Safety Score</span>
              </div>
              <Link href="/dashboard/quiz" className="text-xs text-salama-400 hover:text-salama-300 transition-colors">
                Improve
              </Link>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="font-display font-extrabold text-5xl text-gradient-green leading-none">72</span>
              <span className="text-slate-600 text-lg mb-1">/100</span>
            </div>
            <div className="w-full bg-ink-800/80 rounded-full h-1.5 mb-3">
              <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                className="bg-salama-500 h-1.5 rounded-full glow-green" />
            </div>
            <p className="text-xs text-slate-600">Complete quizzes and tips to raise your score</p>
          </motion.div>

          {/* Latest tips */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="glass rounded-2xl border border-salama-500/12 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="font-display font-semibold text-sm">SalamaLearn</span>
              </div>
              <Link href="/dashboard/learn" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                All <ChevronRight className="w-3 h-3 inline" />
              </Link>
            </div>
            <div className="p-2 space-y-1">
              {latestTips.map((tip, i) => (
                <Link key={i} href="/dashboard/learn"
                  className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/4 transition-colors group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${tip.color.replace('text-','bg-')}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 leading-snug group-hover:text-white transition-colors">{tip.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${tip.color}`}>{tip.category}</span>
                      <span className="text-xs text-slate-700">{tip.difficulty}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
            className="glass rounded-2xl border border-salama-500/12 p-4">
            <p className="font-display font-semibold text-xs text-slate-500 uppercase tracking-widest mb-3">Quick Actions</p>
            <div className="space-y-1">
              {[
                { href:'/dashboard/quiz',    icon:Zap,           label:'Take a Quiz',       color:'text-yellow-400' },
                { href:'/dashboard/report',  icon:AlertTriangle, label:'Report a Scam',     color:'text-amber-400'  },
                { href:'https://wa.me/254700000000?text=Hi', icon:MessageSquare, label:'Chat SalamaBot', color:'text-salama-400', external:true },
              ].map((a) => (
                <Link key={a.href} href={a.href} target={a.external ? '_blank' : undefined}
                  rel={a.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                  <a.icon className={`w-4 h-4 ${a.color} flex-shrink-0`} />
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{a.label}</span>
                  {a.external
                    ? <ExternalLink className="w-3 h-3 text-slate-700 ml-auto" />
                    : <ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-slate-500 ml-auto transition-colors" />}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
