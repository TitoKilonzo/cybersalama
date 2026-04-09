'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Globe, LogOut, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { signOut } from 'next-auth/react'

const AREAS = ['Eastleigh','Kawangware','Kibera','Mathare','Uthiru','Westlands','Langata','South B','South C','Parklands','Kasarani','Embakasi','Other']

export default function SettingsPage() {
  const [profile,  setProfile]  = useState({ name:'', phone:'', area:'' })
  const [notif,    setNotif]    = useState({ whatsapp:true, browser:false, smsAlerts:true })
  const [lang,     setLang]     = useState<'en'|'sw'>('en')
  const [saving,   setSaving]   = useState(false)

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Settings saved successfully')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-slate-500/12 border border-slate-500/20 flex items-center justify-center">
            <Settings className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Settings</h1>
        </div>
        <p className="text-slate-500 text-sm">Manage your SalamaHub account and preferences.</p>
      </div>

      {[
        { icon:User, title:'Profile', color:'text-salama-400', border:'border-salama-500/15', content:(
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Full Name</label>
              <input className="input-cyber" value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))} placeholder="Your name" /></div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">WhatsApp Number</label>
              <input className="input-cyber" value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))} placeholder="+254..." /></div>
            <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Area in Nairobi</label>
              <select className="input-cyber appearance-none" value={profile.area} onChange={e => setProfile(p=>({...p,area:e.target.value}))}>
                <option value="">Select area...</option>{AREAS.map(a=><option key={a} value={a}>{a}</option>)}
              </select></div>
          </div>
        )},
        { icon:Bell, title:'Notifications', color:'text-purple-400', border:'border-purple-500/15', content:(
          <div className="space-y-3">
            {[
              { key:'whatsapp', label:'WhatsApp SalamaAlerts', sub:'Receive critical alerts via WhatsApp' },
              { key:'browser',  label:'Browser notifications', sub:'Push alerts in your browser (requires permission)' },
              { key:'smsAlerts',label:'Area-specific SMS alerts', sub:'SMS when a high-severity threat hits your area' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between p-3.5 rounded-xl glass border border-white/5">
                <div>
                  <div className="text-sm text-slate-200 font-medium">{n.label}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{n.sub}</div>
                </div>
                <button onClick={() => setNotif(v => ({...v, [n.key]: !v[n.key as keyof typeof v]}))}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notif[n.key as keyof typeof notif] ? 'bg-salama-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notif[n.key as keyof typeof notif] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        )},
        { icon:Globe, title:'Language', color:'text-cyan-400', border:'border-cyan-500/15', content:(
          <div className="grid grid-cols-2 gap-3">
            {[['en','English','Receive tips and alerts in English'],['sw','Kiswahili','Pokea vidokezo na tahadhari kwa Kiswahili']] .map(([l,label,desc]) => (
              <button key={l} onClick={() => setLang(l as 'en'|'sw')}
                className={`text-left p-4 rounded-xl border transition-all ${lang===l ? 'bg-salama-500/12 border-salama-500/30 text-salama-300' : 'border-white/7 text-slate-400 hover:border-white/15'}`}>
                <div className="font-semibold text-sm mb-1">{label}</div>
                <div className="text-xs opacity-70">{desc}</div>
                {lang===l && <CheckCircle className="w-3.5 h-3.5 text-salama-400 mt-2" />}
              </button>
            ))}
          </div>
        )},
      ].map(section => (
        <motion.div key={section.title} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          className={`glass rounded-2xl border ${section.border} overflow-hidden`}>
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
            <section.icon className={`w-4 h-4 ${section.color}`} />
            <h2 className="font-display font-semibold text-sm text-white">{section.title}</h2>
          </div>
          <div className="p-5">{section.content}</div>
        </motion.div>
      ))}

      {/* Save */}
      <button onClick={save} disabled={saving} className="btn-primary w-full py-3">
        {saving ? <><span className="w-4 h-4 border-2 border-ink-900/60 border-t-ink-900 rounded-full animate-spin" /> Saving...</> : 'Save Settings'}
      </button>

      {/* Danger zone */}
      <div className="glass rounded-2xl border border-red-500/15 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-500/10">
          <Shield className="w-4 h-4 text-red-400" />
          <h2 className="font-display font-semibold text-sm text-red-400">Account Actions</h2>
        </div>
        <div className="p-5">
          <button onClick={() => signOut({ callbackUrl:'/' })}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out of SalamaHub
          </button>
        </div>
      </div>
    </div>
  )
}
