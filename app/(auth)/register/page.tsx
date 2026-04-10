'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ffffff" aria-label="GitHub">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2" aria-label="Facebook">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const AREAS = ['Eastleigh','Kawangware','Kibera','Mathare','Uthiru','Westlands','Langata','South B',
  'South C','Parklands','Kasarani','Embakasi','Gikomba','Karen','Kilimani','Hurlingham','Roysambu','Other']

function PasswordStrength({ password }: { password: string }) {
  const strength = Math.min(4, Math.floor(password.length / 3))
  const labels = ['','Weak','Fair','Good','Strong']
  const colors = ['','bg-red-500','bg-amber-500','bg-yellow-400','bg-salama-500']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(n => (
          <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${n <= strength ? colors[strength] : 'bg-slate-800'}`} />
        ))}
      </div>
      <p className={`text-xs ${strength<=1?'text-red-400':strength===2?'text-amber-400':strength===3?'text-yellow-400':'text-salama-400'}`}>
        {labels[strength]}
      </p>
    </div>
  )
}

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

export default function RegisterPage() {
  const [form, setForm]   = useState({ name:'', email:'', phone:'', area:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [socialLoading, setSocial] = useState<string|null>(null)
  const [error, setError] = useState('')
  const upd = (k: string, v: string) => setForm(f => ({...f, [k]:v}))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone.trim() || undefined,
        area: form.area.trim() || undefined,
      }
      const res = await fetch('/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email: form.email,
          password: form.password,
        })

        if (result?.ok) {
          toast.success('Account created! Redirecting to dashboard…')
          window.location.replace('/dashboard')
          return
        }

        toast.success('Account created! Please sign in.')
        window.location.replace('/login')
        return
      }

      const d = await res.json().catch(() => null)
      setError(d?.error ?? `Registration failed (${res.status}). Please try again.`)
      setLoading(false)
    } catch (error) {
      console.error('Register error:', error)
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const handleSocial = async (provider: string) => {
    setSocial(provider)
    await signIn(provider, { callbackUrl: '/dashboard' })
  }

  return (
    <div className="bg-auth min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-salama-500/8 rounded-full blur-[100px] pointer-events-none" />

      <Link href="/" className="fixed top-5 left-5 z-20 flex items-center gap-2 text-sm text-slate-400
        hover:text-white glass px-3 py-2 rounded-xl border border-white/8 hover:border-salama-500/30 transition-all">
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">Back to Home</span>
      </Link>

      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 w-full max-w-[420px]">

        <motion.div variants={fadeUp} className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 rounded-2xl bg-salama-500 flex items-center justify-center
              shadow-[0_0_32px_rgba(20,179,116,0.4)] group-hover:shadow-[0_0_48px_rgba(20,179,116,0.6)] transition-all">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gradient-green">CyberSalama</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Create your free SalamaHub account</p>
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
          style={{ background:'rgba(13,21,38,0.85)', backdropFilter:'blur(24px)', border:'1px solid rgba(20,179,116,0.16)' }}>

          <div className="p-6 space-y-3">
            <p className="text-xs text-center text-slate-600 mb-4 font-medium">Quick sign up with</p>
            {[
              { provider:'google',   icon:<GoogleIcon />,   label:'Continue with Google',   cls:'bg-white/5 border-white/10 hover:bg-white/10' },
              { provider:'github',   icon:<GithubIcon />,   label:'Continue with GitHub',   cls:'bg-[#24292e]/60 border-white/10 hover:bg-[#24292e]/90' },
              { provider:'facebook', icon:<FacebookIcon />, label:'Continue with Facebook', cls:'bg-[#1877F2]/15 border-[#1877F2]/30 hover:bg-[#1877F2]/25' },
            ].map(({ provider, icon, label, cls }) => (
              <button key={provider} onClick={() => handleSocial(provider)} disabled={!!socialLoading || loading}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all active:scale-[0.98] hover:border-white/20 disabled:opacity-50 ${cls}`}>
                {socialLoading === provider
                  ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                  : <>{icon}<span className="text-sm font-medium text-white text-left">{label}</span></>}
              </button>
            ))}
          </div>

          <div className="px-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-slate-600 font-medium px-2">or register with email</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input type="text" required placeholder="Your name" value={form.name}
                  onChange={e => upd('name', e.target.value)} className="input-cyber pl-10" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input type="email" required placeholder="you@example.com" value={form.email}
                  onChange={e => upd('email', e.target.value)} className="input-cyber pl-10" />
              </div>
            </div>
            {/* Phone + Area */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  WhatsApp <span className="normal-case text-slate-700">(opt)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                  <input type="tel" placeholder="+254…" value={form.phone}
                    onChange={e => upd('phone', e.target.value)} className="input-cyber pl-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Area</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
                  <select value={form.area} onChange={e => upd('area', e.target.value)} className="input-cyber pl-9 text-sm appearance-none">
                    <option value="">Select…</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} required placeholder="Min. 8 characters"
                  value={form.password} onChange={e => upd('password', e.target.value)} className="input-cyber pl-10 pr-11" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors p-0.5">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <button type="submit" disabled={loading || !!socialLoading} className="btn-primary w-full py-3.5 mt-1 text-sm">
              {loading
                ? <><span className="w-4 h-4 border-2 border-green-900/40 border-t-green-950 rounded-full animate-spin" /> Creating account…</>
                : <><CheckCircle2 className="w-4 h-4" /> Create Free Account</>}
            </button>
            <p className="text-xs text-center text-slate-700 pt-1">
              By registering you agree to use this platform responsibly for community safety.
            </p>
          </form>
        </motion.div>

        <motion.p variants={fadeUp} className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-salama-400 hover:text-salama-300 font-semibold transition-colors">
            Sign in →
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
