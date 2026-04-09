'use client'

import { useState } from 'react'
import { AlertTriangle, MapPin, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const NAIROBI_AREAS = [
  'Eastleigh', 'Kawangware', 'Kibera', 'Mathare', 'Uthiru',
  'Westlands', 'Langata', 'South B', 'South C', 'Parklands',
  'Kasarani', 'Embakasi', 'Ruaraka', 'Dagoretti', 'Njiru',
  'Roysambu', 'Starehe', 'Makadara', 'Kamukunji', 'Pumwani',
  'Gikomba', 'Industrial Area', 'Karen', 'Lavington', 'Kilimani',
  'Hurlingham', 'Runda', 'Muthaiga', 'Gigiri', 'Other',
]

const THREAT_TYPES = [
  { value: 'PHISHING',         label: 'Phishing (Fake SMS/Email/Call)' },
  { value: 'SIM_SWAP',         label: 'SIM Swap Fraud' },
  { value: 'MPESA_FRAUD',      label: 'M-Pesa Fraud / Impersonation' },
  { value: 'FAKE_LOAN',        label: 'Fake Loan App / Offer' },
  { value: 'ACCOUNT_TAKEOVER', label: 'Account Takeover' },
  { value: 'FAKE_JOB',         label: 'Fake Job Offer' },
  { value: 'ROMANCE_SCAM',     label: 'Romance / Investment Scam' },
  { value: 'OTHER',            label: 'Other' },
]

const SEVERITIES = [
  { value: 'LOW',      label: 'Low — Minor nuisance, no financial loss' },
  { value: 'MEDIUM',   label: 'Medium — Attempted fraud, no loss' },
  { value: 'HIGH',     label: 'High — Financial loss occurred' },
  { value: 'CRITICAL', label: 'Critical — Ongoing active threat, widespread' },
]

export default function SalamaWatchPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({
    type: '', area: '', severity: 'MEDIUM',
    title: '', description: '', source: 'WEB',
  })

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type || !form.area || !form.title || !form.description) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
        toast.success('Report submitted. Thank you for protecting your community!')
      } else {
        toast.error('Submission failed. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-salama-500/20 border border-salama-500/30 flex items-center justify-center mx-auto mb-6 glow-green">
          <CheckCircle className="w-8 h-8 text-salama-400" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-3 text-gradient-green">Report Received</h2>
        <p className="text-ink-300 mb-2">Your fraud report has been submitted to the SalamaWatch community database.</p>
        <p className="text-ink-500 text-sm mb-8">Our moderators will review and verify it. If confirmed, a SalamaAlert will be sent to community members in the affected area.</p>
        <button onClick={() => { setSubmitted(false); setForm({ type:'', area:'', severity:'MEDIUM', title:'', description:'', source:'WEB' }) }} className="btn-primary">
          Submit Another Report
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <h1 className="font-display font-bold text-2xl text-white">SalamaWatch</h1>
        </div>
        <p className="text-ink-400 text-sm">Report a scam or fraud incident in your community. Your report protects others.</p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-ink-900 border border-ink-700 text-sm text-ink-400">
        <MapPin className="w-4 h-4 text-salama-400 mt-0.5 flex-shrink-0" />
        <p>Reports are reviewed by our team and verified by the community. Confirmed reports appear on ThreatRadar and trigger SalamaAlerts for affected areas.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass rounded-xl border border-salama-500/15 p-6 space-y-5">

        {/* Threat type */}
        <div>
          <label className="block text-sm font-medium text-ink-200 mb-2">Fraud Type <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {THREAT_TYPES.map((t) => (
              <button
                key={t.value} type="button"
                onClick={() => update('type', t.value)}
                className={`text-left px-3 py-2.5 rounded-lg text-xs border transition-all ${
                  form.type === t.value
                    ? 'bg-salama-500/20 border-salama-500/40 text-salama-300'
                    : 'border-ink-700 text-ink-400 hover:border-ink-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Area + severity */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-2">Area / Estate <span className="text-red-400">*</span></label>
            <select value={form.area} onChange={(e) => update('area', e.target.value)} className="input-cyber">
              <option value="">Select area...</option>
              {NAIROBI_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-200 mb-2">Severity</label>
            <select value={form.severity} onChange={(e) => update('severity', e.target.value)} className="input-cyber">
              {SEVERITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-ink-200 mb-2">Short Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            placeholder="e.g. Fake Safaricom agent calling for PINs in Eastleigh"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            maxLength={120}
            className="input-cyber"
          />
          <div className="text-xs text-ink-600 mt-1 text-right">{form.title.length}/120</div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-ink-200 mb-2">Full Description <span className="text-red-400">*</span></label>
          <textarea
            rows={5}
            placeholder="Describe what happened in detail. Include phone numbers involved, what they said, how much was lost, and any other relevant info. You can write in Swahili or English."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="input-cyber resize-none"
          />
          <p className="text-xs text-ink-600 mt-1">Do not include your own full name, ID number, or bank account details</p>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              Submit Fraud Report
            </>
          )}
        </button>
      </form>
    </div>
  )
}
