'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)
const GitHubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current text-blue-500" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const AREAS = ['Eastleigh','Kawangware','Kibera','Mathare','Uthiru','Westlands','Langata',
  'South B','South C','Parklands','Kasarani','Embakasi','Gikomba','Ruaraka',
  'Karen','Kilimani','Hurlingham','Roysambu','Starehe','Makadara','Other']

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm]   = useState({ name:'', email:'', phone:'', area:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Welcome to CyberSalama!')
        router.push('/dashboard')
      } else {
        const d = await res.json()
        toast.error(d.error ?? 'Registration failed')
      }
    } catch { toast.error('Network error. Try again.') }
    finally { setLoading(false) }
  }

  const handleSocial = async (provider: string) => {
    setSocialLoading(provider)
    try { await signIn(provider, { callbackUrl: '/dashboard' }) }
    catch { toast.error(`${provider} sign-in failed.`); setSocialLoading(null) }
  }

  return (
    <div className="bg-auth min-h-screen flex items-center justify-center px-4 py-16">

      <Link href="/"
        className="fixed top-5 left-5 z-20 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors glass px-3 py-2 rounded-xl border border-salama-500/15 hover:border-salama-500/30">
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <motion.div variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08 }}}}
        initial="hidden" animate="show" className="relative z-10 w-full max-w-[420px]">

        <motion.div variants={fadeUp} className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-salama-500 flex items-center justify-center glow-green group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7 text-ink-950" />
            </div>
            <span className="font-display font-bold text-xl text-gradient-green">CyberSalama</span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">Create your free SalamaHub account</p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass-bright rounded-2xl border border-salama-500/18 overflow-hidden">

          {/* Social */}
          <div className="p-6 pb-0 space-y-2.5">
            {[
              { provider:'google',   icon:<GoogleIcon />,   label:'Continue with Google' },
              { provider:'github',   icon:<GitHubIcon />,   label:'Continue with GitHub' },
              { provider:'facebook', icon:<FacebookIcon />, label:'Continue with Facebook' },
            ].map(({ provider, icon, label }) => (
              <button key={provider} onClick={() => handleSocial(provider)} disabled={!!socialLoading}
                className="btn-social">
                {socialLoading === provider
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : icon}
                {label}
              </button>
            ))}
          </div>

          <div className="px-6 mt-5">
            <div className="divider"><span>or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type="text" required placeholder="Your name"
                  value={form.name} onChange={e => upd('name', e.target.value)} className="input-cyber pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => upd('email', e.target.value)} className="input-cyber pl-10" />
              </div>
            </div>

            {/* Phone + Area — 2 col */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                  WhatsApp <span className="text-slate-600 normal-case">(opt)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <input type="tel" placeholder="+254..." value={form.phone}
                    onChange={e => upd('phone', e.target.value)} className="input-cyber pl-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Area</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <select value={form.area} onChange={e => upd('area', e.target.value)} className="input-cyber pl-9 text-sm appearance-none">
                    <option value="">Select...</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} required placeholder="Min. 8 characters"
                  value={form.password} onChange={e => upd('password', e.target.value)} className="input-cyber pl-10 pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(n => (
                    <div key={n} className={`h-1 flex-1 rounded-full transition-all ${
                      form.password.length >= n * 3
                        ? n <= 2 ? 'bg-red-500' : n === 3 ? 'bg-amber-500' : 'bg-salama-500'
                        : 'bg-ink-700'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1 text-sm">
              {loading
                ? <><span className="w-4 h-4 border-2 border-ink-900/60 border-t-ink-900 rounded-full animate-spin" /> Creating account...</>
                : 'Create Free Account'}
            </button>

            <p className="text-xs text-slate-600 text-center pt-1">
              By registering you agree to use this platform responsibly and in service of your community.
            </p>
          </form>
        </motion.div>

        <motion.p variants={fadeUp} className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-salama-400 hover:text-salama-300 font-medium transition-colors">
            Sign in →
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
