'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, CheckCircle, Shield, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const AREAS = ['Eastleigh','Kawangware','Kibera','Mathare','Uthiru','Westlands','Langata',
  'South B','South C','Parklands','Kasarani','Embakasi','Ruaraka','Dagoretti','Njiru',
  'Roysambu','Starehe','Makadara','Kamukunji','Pumwani','Gikomba','Industrial Area',
  'Karen','Lavington','Kilimani','Hurlingham','Runda','Muthaiga','Gigiri','Other']

const THREAT_TYPES = [
  { value:'PHISHING',         label:'📧 Phishing',              sub:'Fake SMS, email, or call' },
  { value:'SIM_SWAP',         label:'📱 SIM Swap',              sub:'Number ported without consent' },
  { value:'MPESA_FRAUD',      label:'💸 M-Pesa Fraud',          sub:'Impersonation, wrong number' },
  { value:'FAKE_LOAN',        label:'🏦 Fake Loan App',         sub:'Fake loan offer or app' },
  { value:'ACCOUNT_TAKEOVER', label:'🔓 Account Takeover',      sub:'Social media, email, bank' },
  { value:'FAKE_JOB',         label:'💼 Fake Job Offer',        sub:'Advance fee job scam' },
  { value:'ROMANCE_SCAM',     label:'❤️ Romance / Investment',  sub:'Fake relationship or returns' },
  { value:'OTHER',            label:'⚠️ Other',                 sub:'Any other digital fraud' },
]

const SEVERITIES = [
  { value:'LOW',      label:'Low',      sub:'Minor nuisance, no loss',       color:'text-green-400' },
  { value:'MEDIUM',   label:'Medium',   sub:'Attempted fraud, no loss',      color:'text-yellow-400' },
  { value:'HIGH',     label:'High',     sub:'Financial loss occurred',       color:'text-orange-400' },
  { value:'CRITICAL', label:'Critical', sub:'Active ongoing, widespread',    color:'text-red-400' },
]

export default function SalamaWatchPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({ type:'', area:'', severity:'MEDIUM', title:'', description:'' })
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type || !form.area || !form.title || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'WEB' }),
      })
      if (res.ok) { setSubmitted(true); toast.success('Report received — thank you!') }
      else         { toast.error('Submission failed. Please try again.') }
    } catch { toast.error('Network error. Please try again.') }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', damping:14 }}>
          <div className="w-20 h-20 rounded-2xl bg-salama-500/15 border border-salama-500/30 flex items-center justify-center mx-auto mb-6 glow-green">
            <CheckCircle className="w-10 h-10 text-salama-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gradient-green mb-3">Report Received</h2>
          <p className="text-slate-300 text-base mb-2">Thank you for protecting your community.</p>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            Your report has been added to SalamaWatch. Moderators will verify it — if confirmed, a SalamaAlert will be sent to community members in that area.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => { setSubmitted(false); setForm({ type:'', area:'', severity:'MEDIUM', title:'', description:'' }) }}
              className="btn-ghost px-6 py-2.5">Submit Another</button>
            <Link href="/dashboard" className="btn-primary px-6 py-2.5">Back to Dashboard</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500/12 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">SalamaWatch</h1>
        </div>
        <p className="text-slate-500 text-sm">Report a fraud or scam. Your report protects your community.</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl glass border border-salama-500/14 text-sm text-slate-400">
        <Shield className="w-4 h-4 text-salama-400 mt-0.5 flex-shrink-0" />
        <p>Reports are reviewed by our team and verified by the community. Confirmed reports appear on ThreatRadar and trigger SalamaAlerts for affected areas. Your identity is not shared.</p>
      </div>

      {/* Form */}
      <motion.form onSubmit={handleSubmit} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        className="glass rounded-2xl border border-amber-500/14 p-6 space-y-6">

        {/* Threat type */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Fraud Type <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {THREAT_TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => upd('type', t.value)}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${
                  form.type === t.value
                    ? 'bg-amber-500/14 border-amber-500/40 text-amber-300'
                    : 'border-white/7 text-slate-400 hover:border-white/15 hover:text-slate-200'
                }`}>
                <div className="text-sm font-medium">{t.label}</div>
                <div className="text-xs text-slate-600 mt-0.5">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Area + Severity */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Area / Estate <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              <select value={form.area} onChange={e => upd('area', e.target.value)} className="input-cyber pl-9 appearance-none">
                <option value="">Select area...</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Severity</label>
            <div className="space-y-1.5">
              {SEVERITIES.map(s => (
                <button key={s.value} type="button" onClick={() => upd('severity', s.value)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl border transition-all text-xs ${
                    form.severity === s.value
                      ? 'bg-white/7 border-white/15 text-white'
                      : 'border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                  }`}>
                  <span className={`font-semibold w-16 ${s.color}`}>{s.label}</span>
                  <span className="text-slate-600">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Short Title <span className="text-red-400">*</span>
          </label>
          <input type="text" placeholder="e.g. Fake Safaricom agent calling for PINs in Eastleigh"
            value={form.title} onChange={e => upd('title', e.target.value)} maxLength={120} className="input-cyber" />
          <div className="text-xs text-slate-700 mt-1 text-right">{form.title.length}/120</div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Full Description <span className="text-red-400">*</span>
          </label>
          <textarea rows={5} placeholder="Describe what happened in detail. Include phone numbers involved, what was said, how much was lost, and any other relevant details that could warn others. Swahili or English accepted."
            value={form.description} onChange={e => upd('description', e.target.value)} className="input-cyber resize-none" />
          <p className="text-xs text-slate-700 mt-1">Do not include your full name, ID number, or bank account details</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
          {loading
            ? <><span className="w-4 h-4 border-2 border-ink-900/60 border-t-ink-900 rounded-full animate-spin" /> Submitting...</>
            : <><AlertTriangle className="w-4 h-4" /> Submit Fraud Report</>}
        </button>
      </motion.form>
    </div>
  )
}
