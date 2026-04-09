'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, Filter, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'

// Leaflet must be dynamically imported (no SSR) due to browser-only APIs
const ThreatMap = dynamic(() => import('@/components/portal/ThreatMap'), { ssr: false, loading: () => (
  <div className="h-full flex items-center justify-center bg-ink-950 rounded-xl border border-salama-500/15">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-salama-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-ink-400 text-sm">Loading ThreatRadar...</p>
    </div>
  </div>
)})

const THREAT_TYPES = ['ALL', 'PHISHING', 'SIM_SWAP', 'MPESA_FRAUD', 'FAKE_LOAN', 'ACCOUNT_TAKEOVER', 'FAKE_JOB']
const SEVERITIES   = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const severityStyle: Record<string, string> = {
  CRITICAL: 'badge-critical',
  HIGH:     'badge-high',
  MEDIUM:   'badge-medium',
  LOW:      'badge-low',
}

const sampleReports = [
  { id: '1', type: 'SIM_SWAP',    area: 'Eastleigh',  severity: 'HIGH',     lat: -1.2792, lng: 36.8518, desc: 'SIM-swap fraud at telecom outlets near Eastleigh Section 3', time: '2h ago', verified: true },
  { id: '2', type: 'PHISHING',    area: 'Kawangware', severity: 'MEDIUM',   lat: -1.2697, lng: 36.7422, desc: 'Fake KCB loan approval SMS with malicious link', time: '4h ago', verified: false },
  { id: '3', type: 'MPESA_FRAUD', area: 'Uthiru',     severity: 'HIGH',     lat: -1.2650, lng: 36.7100, desc: 'Impersonation calls from fake Safaricom agents', time: '6h ago', verified: true },
  { id: '4', type: 'FAKE_LOAN',   area: 'Kibera',     severity: 'CRITICAL', lat: -1.3133, lng: 36.7830, desc: 'Fraudulent loan app "KwikCash" stealing ID data', time: '1d ago', verified: true },
  { id: '5', type: 'PHISHING',    area: 'Westlands',  severity: 'MEDIUM',   lat: -1.2636, lng: 36.8056, desc: 'Fake equity bank email requesting login credentials', time: '1d ago', verified: false },
  { id: '6', type: 'SIM_SWAP',    area: 'Mathare',    severity: 'HIGH',     lat: -1.2544, lng: 36.8589, desc: 'Series of SIM-swap incidents reported to Safaricom', time: '2d ago', verified: true },
]

export default function ThreatRadarPage() {
  const [typeFilter,     setTypeFilter]     = useState('ALL')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [selectedReport, setSelectedReport] = useState<typeof sampleReports[0] | null>(null)

  const filtered = sampleReports.filter((r) => {
    if (typeFilter !== 'ALL'     && r.type !== typeFilter)         return false
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-red-400" />
            <h1 className="font-display font-bold text-2xl text-white">ThreatRadar</h1>
          </div>
          <p className="text-ink-400 text-sm">Live crowd-sourced fraud map across Nairobi estates</p>
        </div>
        <button className="btn-ghost text-sm py-2 gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl border border-salama-500/15 p-4">
        <div className="flex items-center gap-2 mb-3 text-xs text-ink-500">
          <Filter className="w-3.5 h-3.5" /> Filters
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-1">
            {THREAT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  typeFilter === t
                    ? 'bg-salama-500/20 border-salama-500/40 text-salama-400'
                    : 'border-ink-700 text-ink-400 hover:border-ink-600'
                }`}
              >
                {t === 'ALL' ? 'All Types' : t.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-ink-700 self-center hidden md:block" />
          <div className="flex flex-wrap gap-1">
            {SEVERITIES.map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  severityFilter === s
                    ? 'bg-salama-500/20 border-salama-500/40 text-salama-400'
                    : 'border-ink-700 text-ink-400 hover:border-ink-600'
                }`}
              >
                {s === 'ALL' ? 'All Severity' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map + list */}
      <div className="grid lg:grid-cols-3 gap-5" style={{ height: '520px' }}>

        {/* Map */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-salama-500/15" style={{ height: '520px' }}>
          <ThreatMap reports={filtered} onSelect={setSelectedReport} selected={selectedReport} />
        </div>

        {/* Report list */}
        <div className="glass rounded-xl border border-salama-500/15 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-ink-800 flex items-center justify-between">
            <span className="text-sm font-medium text-ink-200">{filtered.length} reports</span>
            <span className="text-xs text-ink-500">Click to locate</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-ink-800/50">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`w-full text-left px-4 py-3.5 hover:bg-ink-800/40 transition-colors ${
                  selectedReport?.id === r.id ? 'bg-salama-500/8 border-l-2 border-salama-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="threat-chip text-xs">{r.type.replace(/_/g, ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityStyle[r.severity]}`}>
                    {r.severity}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3 h-3 text-ink-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-ink-300">{r.area}</span>
                  {r.verified && (
                    <span className="text-xs text-salama-500 ml-auto">✓ Verified</span>
                  )}
                </div>
                <p className="text-xs text-ink-500 leading-relaxed line-clamp-2">{r.desc}</p>
                <div className="text-xs text-ink-700 mt-1">{r.time}</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-center text-ink-500 text-sm">
                No reports match your filters
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected detail */}
      {selectedReport && (
        <div className="glass rounded-xl border border-salama-500/20 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${severityStyle[selectedReport.severity]}`}>
                  {selectedReport.severity}
                </span>
                <span className="threat-chip">{selectedReport.type.replace(/_/g, ' ')}</span>
                <span className="text-xs text-ink-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {selectedReport.area}
                </span>
                {selectedReport.verified && <span className="text-xs text-salama-500">✓ Community verified</span>}
              </div>
            </div>
            <button onClick={() => setSelectedReport(null)} className="text-ink-600 hover:text-ink-400 text-sm">✕</button>
          </div>
          <p className="text-sm text-ink-300 leading-relaxed mb-3">{selectedReport.desc}</p>
          <div className="flex items-center gap-4 text-xs text-ink-600">
            <span>Reported: {selectedReport.time}</span>
            <span>Coordinates: {selectedReport.lat.toFixed(4)}, {selectedReport.lng.toFixed(4)}</span>
          </div>
        </div>
      )}

    </div>
  )
}
