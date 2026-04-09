'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'

// Leaflet CSS must be imported client-side only
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css')
}

interface Report {
  id: string; type: string; area: string; severity: string
  lat: number; lng: number; desc: string; time: string; verified: boolean
}
interface Props { reports: Report[]; onSelect: (r: Report) => void; selected: Report | null }

const severityColor: Record<string, string> = { CRITICAL:'#ef4444', HIGH:'#f97316', MEDIUM:'#eab308', LOW:'#22c55e' }
const severityRadius: Record<string, number> = { CRITICAL:22, HIGH:17, MEDIUM:13, LOW:9 }

function FlyTo({ selected }: { selected: Report | null }) {
  const map = useMap()
  useEffect(() => { if (selected) map.flyTo([selected.lat, selected.lng], 14, { duration:1.2 }) }, [selected, map])
  return null
}

export default function ThreatMap({ reports, onSelect, selected }: Props) {
  const center: [number, number] = [-1.2921, 36.8219]
  return (
    <MapContainer center={center} zoom={12} style={{ height:'100%', width:'100%' }} zoomControl={false}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {reports.map(r => (
        <CircleMarker key={r.id} center={[r.lat, r.lng]}
          radius={severityRadius[r.severity] ?? 12}
          pathOptions={{ fillColor:severityColor[r.severity]??'#94a3b8', fillOpacity:selected?.id===r.id?0.9:0.65,
            color:severityColor[r.severity]??'#94a3b8', weight:selected?.id===r.id?3:1.5, opacity:0.9 }}
          eventHandlers={{ click:()=>onSelect(r) }}>
          <Popup>
            <div style={{ fontFamily:'DM Sans,sans-serif', minWidth:180 }}>
              <div style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>{r.type.replace(/_/g,' ')} · {r.area}</div>
              <div style={{ fontSize:13, color:'#f1f5f9', fontWeight:600, marginBottom:6 }}>{r.severity}</div>
              <p style={{ fontSize:12, color:'#cbd5e1', lineHeight:1.5, margin:0 }}>{r.desc}</p>
              <div style={{ fontSize:11, color:'#475569', marginTop:6 }}>{r.time}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      <FlyTo selected={selected} />
    </MapContainer>
  )
}
