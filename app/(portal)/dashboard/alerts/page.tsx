'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bell, MapPin, Clock, Shield, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react'

const alerts = [
  { id:'a1', severity:'CRITICAL', active:true, area:'Eastleigh, Mathare', createdAt:'2 hours ago', expiresAt:'24 hours',
    titleEn:'Active SIM Swap Wave — Eastleigh & Mathare',
    bodyEn:'Multiple verified reports of SIM swap fraud across Eastleigh and Mathare. Criminals are using forged IDs at telecom shops. Contact your provider NOW to put a SIM lock on your number. Do not respond to any calls asking you to "activate your SIM".' },
  { id:'a2', severity:'HIGH', active:true, area:'Nairobi-wide', createdAt:'5 hours ago', expiresAt:'48 hours',
    titleEn:'Fake KCB Loan Approval SMS Circulating',
    bodyEn:'A fake SMS claiming to be from KCB Bank promises instant loan approval of KES 50,000. The link leads to a phishing site that steals your banking credentials. DO NOT click the link. Report to DCI Cyber Crime on 0800 722 203.' },
  { id:'a3', severity:'MEDIUM', active:true, area:'Kawangware', createdAt:'1 day ago', expiresAt:'3 days',
    titleEn:'Fake Safaricom Agents Door-to-Door — Kawangware',
    bodyEn:'Individuals dressed as Safaricom agents are visiting homes in Kawangware asking residents to "update their M-Pesa details". Safaricom does not conduct door-to-door visits. Do not give them any information or allow them inside.' },
  { id:'a4', severity:'HIGH', active:false, area:'Nairobi-wide', createdAt:'3 days ago', expiresAt:'Expired',
    titleEn:'"KwikCash" Fraudulent Loan App — Resolved',
    bodyEn:'The fraudulent "KwikCash" app has been removed from the Play Store following reports. If you installed it, uninstall immediately and change all passwords. Monitor your M-Pesa and bank accounts for suspicious activity.' },
  { id:'a5', severity:'MEDIUM', active:false, area:'Westlands', createdAt:'5 days ago', expiresAt:'Expired',
    titleEn:'Fake Equity Bank Email Phishing Campaign',
    bodyEn:'A phishing email impersonating Equity Bank requested login credentials under the guise of "account verification". Equity Bank will never ask for your password via email. Threat has been mitigated.' },
]

const severityStyle: Record<string, string> = {
  CRITICAL: 'badge-critical', HIGH: 'badge-high', MEDIUM: 'badge-medium', LOW: 'badge-low',
}
const severityBorder: Record<string, string> = {
  CRITICAL: 'border-red-500/25',
  HIGH:     'border-orange-500/20',
  MEDIUM:   'border-yellow-500/18',
  LOW:      'border-green-500/18',
}
const severityAccent: Record<string, string> = {
  CRITICAL: 'bg-red-500/8',
  HIGH:     'bg-orange-500/7',
  MEDIUM:   'bg-yellow-500/6',
  LOW:      'bg-green-500/6',
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp  = { hidden: { opacity:0, y:14 }, show: { opacity:1, y:0, transition: { duration:0.4 } } }

export default function SalamaAlertPage() {
  const active  = alerts.filter(a => a.active)
  const expired = alerts.filter(a => !a.active)

  return (
    <div className="max-w-3xl mx-auto space-y-7">

      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-purple-500/12 border border-purple-500/20 flex items-center justify-center">
                <Bell className="w-4.5 h-4.5 text-purple-400" />
              </div>
              <h1 className="font-display font-bold text-2xl text-white">SalamaAlert</h1>
            </div>
            <p className="text-slate-500 text-sm">Active fraud alerts for Nairobi communities</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/25 bg-red-500/8 text-xs text-red-400 font-medium">
            <span className="live-dot" />
            {active.length} active alert{active.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Active */}
      <div>
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-4">Active Alerts</p>
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {active.map(a => (
            <motion.div key={a.id} variants={fadeUp}
              className={`glass rounded-2xl border p-5 ${severityBorder[a.severity]} ${severityAccent[a.severity]}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={severityStyle[a.severity]}>{a.severity}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />{a.area}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-600 flex-shrink-0">
                  <Clock className="w-3 h-3" />{a.createdAt}
                </span>
              </div>
              <h3 className="font-display font-semibold text-sm text-white mb-2">{a.titleEn}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{a.bodyEn}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Shield className="w-3 h-3" /> Expires: {a.expiresAt}
                </div>
                <Link href="/dashboard/report" className="text-xs text-salama-400 hover:text-salama-300 transition-colors flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Report related incident
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Divider */}
      <div className="divider"><span>Resolved Alerts</span></div>

      {/* Expired */}
      <div className="space-y-2">
        {expired.map(a => (
          <div key={a.id}
            className="glass rounded-2xl border border-white/5 p-4 opacity-50 hover:opacity-70 transition-opacity">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-salama-600" />
              <span className="text-xs text-slate-600 font-semibold">RESOLVED</span>
              <span className="text-xs text-slate-700 border border-white/8 px-2 py-0.5 rounded-full">{a.severity}</span>
              <span className="text-xs text-slate-700">{a.area}</span>
              <span className="text-xs text-slate-800 ml-auto">{a.createdAt}</span>
            </div>
            <p className="text-sm text-slate-500">{a.titleEn}</p>
          </div>
        ))}
      </div>

      {/* Stay safe tip */}
      <div className="glass rounded-2xl border border-salama-500/14 p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-salama-500/12 border border-salama-500/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-salama-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">Stay ahead of threats</p>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Report fraud incidents via SalamaWatch to help generate alerts for your community, 
            or try SalamaBot on WhatsApp for real-time area-specific warnings.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/dashboard/report" className="text-xs text-amber-400 font-medium hover:text-amber-300 transition-colors">
              Report a scam →
            </Link>
            <a href="https://wa.me/254700000000?text=Hi%20SalamaBot" target="_blank" rel="noopener noreferrer"
              className="text-xs text-salama-400 font-medium hover:text-salama-300 transition-colors">
              Open SalamaBot →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
