import { Bell, MapPin, Clock, Shield } from 'lucide-react'

const alerts = [
  {
    id: 'a1', severity: 'CRITICAL', active: true,
    titleEn: 'Active SIM Swap Wave — Eastleigh & Mathare',
    titleSw: 'Wimbi la SIM Swap Unaofanya Kazi — Eastleigh na Mathare',
    bodyEn: 'Multiple verified reports of SIM swap fraud across Eastleigh and Mathare. Criminals are using forged IDs at Safaricom shops. Contact your provider NOW to put a SIM lock on your number. Do not respond to any calls asking you to "activate your SIM".',
    bodySw: 'Ripoti nyingi zilizothibitishwa za udanganyifu wa SIM swap Eastleigh na Mathare. Wasiliana na mtoa huduma wako SASA kuweka kufuli ya SIM kwenye nambari yako.',
    area: 'Eastleigh, Mathare',
    createdAt: '2 hours ago',
    expiresAt: '24 hours',
  },
  {
    id: 'a2', severity: 'HIGH', active: true,
    titleEn: 'Fake KCB Loan Approval SMS Circulating',
    titleSw: 'SMS Bandia ya Idhini ya Mkopo wa KCB Inasambazwa',
    bodyEn: 'A fake SMS claiming to be from KCB Bank is circulating, promising instant loan approval of KES 50,000. The link leads to a phishing site that steals your banking credentials. DO NOT click the link.',
    bodySw: 'SMS bandia inayodai kutoka KCB Bank inasambazwa, ikiahidi mkopo wa papo hapo wa KES 50,000. Kiungo kinaelekeza kwenye tovuti ya kuiba data. USIBONYEZE kiungo.',
    area: 'Nairobi-wide',
    createdAt: '5 hours ago',
    expiresAt: '48 hours',
  },
  {
    id: 'a3', severity: 'MEDIUM', active: true,
    titleEn: 'Fake Safaricom Agents in Kawangware',
    titleSw: 'Mawakala wa Safaricom Bandia Kawangware',
    bodyEn: 'Individuals dressed as Safaricom agents are visiting homes in Kawangware asking residents to "update their M-Pesa details". Safaricom does not conduct door-to-door visits. Do not give them any information.',
    bodySw: 'Watu wanaovaa kama mawakala wa Safaricom wanatembelea nyumba Kawangware. Safaricom haifanyi ziara za nyumba kwa nyumba. Usitoe habari yoyote.',
    area: 'Kawangware',
    createdAt: '1 day ago',
    expiresAt: '3 days',
  },
  {
    id: 'a4', severity: 'HIGH', active: false,
    titleEn: '"KwikCash" Fraudulent Loan App — Resolved',
    titleSw: '"KwikCash" Programu ya Mkopo ya Ulaghai — Imesuluhiwa',
    bodyEn: 'The fraudulent "KwikCash" app has been removed from the Play Store. If you installed it, uninstall immediately and change all passwords. Monitor your M-Pesa and bank accounts for suspicious activity.',
    bodySw: 'Programu ya ulaghai "KwikCash" imeondolewa kwenye Play Store. Ukiwa umesakinisha, ondoa mara moja na ubadilishe nywila zote.',
    area: 'Nairobi-wide',
    createdAt: '3 days ago',
    expiresAt: 'Expired',
  },
]

const severityStyle: Record<string, string> = {
  CRITICAL: 'badge-critical',
  HIGH:     'badge-high',
  MEDIUM:   'badge-medium',
  LOW:      'badge-low',
}

const severityBorder: Record<string, string> = {
  CRITICAL: 'border-red-500/30',
  HIGH:     'border-orange-500/25',
  MEDIUM:   'border-yellow-500/20',
  LOW:      'border-green-500/20',
}

export default function SalamaAlertPage() {
  const active  = alerts.filter((a) => a.active)
  const expired = alerts.filter((a) => !a.active)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-purple-400" />
            <h1 className="font-display font-bold text-2xl text-white">SalamaAlert</h1>
          </div>
          <p className="text-ink-400 text-sm">Active fraud alerts for Nairobi communities</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/25 bg-red-500/8 text-xs text-red-400 font-medium">
          <span className="live-dot" />
          {active.length} active alerts
        </div>
      </div>

      {/* Active */}
      <div>
        <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-widest mb-3">Active Alerts</h2>
        <div className="space-y-3">
          {active.map((a) => (
            <div key={a.id} className={`glass rounded-xl border p-5 ${severityBorder[a.severity]}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${severityStyle[a.severity]}`}>
                    {a.severity}
                  </span>
                  <span className="text-xs text-ink-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {a.area}
                  </span>
                </div>
                <span className="text-xs text-ink-600 flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-3 h-3" /> {a.createdAt}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-ink-100 mb-2">{a.titleEn}</h3>
              <p className="text-xs text-ink-400 leading-relaxed mb-3">{a.bodyEn}</p>
              <div className="text-xs text-ink-600 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Expires: {a.expiresAt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expired */}
      {expired.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-ink-600 uppercase tracking-widest mb-3">Past Alerts</h2>
          <div className="space-y-3">
            {expired.map((a) => (
              <div key={a.id} className="glass rounded-xl border border-ink-800 p-5 opacity-60">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full border border-ink-700 text-ink-500">{a.severity}</span>
                  <span className="text-xs text-ink-600">{a.area}</span>
                  <span className="ml-auto text-xs text-ink-700">{a.createdAt}</span>
                </div>
                <h3 className="text-sm text-ink-500">{a.titleEn}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
