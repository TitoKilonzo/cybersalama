'use client'
import PageBackground from '@/components/ui/PageBackground'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Shield, MapPin, BookOpen, AlertTriangle, Zap, Bell,
  MessageSquare, ChevronRight, ArrowRight, Globe, Lock,
  Users, CheckCircle, ExternalLink, Menu, X
} from 'lucide-react'

/* ── Animated counter ─────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 40)
    const t = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(t) }
      else setCount(start)
    }, 30)
    return () => clearInterval(t)
  }, [target])
  return <>{count}{suffix}</>
}

const features = [
  { icon: MessageSquare, name: 'SalamaBot',   tag: 'WhatsApp Chatbot',     color: 'text-salama-400',  glow: 'glow-green',  border: 'border-salama-500/20', bg: 'bg-salama-500/8',   desc: 'Daily security tips, live fraud alerts, and instant Q&A — in Swahili or English, on WhatsApp. No app needed.', href: '/dashboard' },
  { icon: MapPin,        name: 'ThreatRadar', tag: 'Live Fraud Map',        color: 'text-red-400',     glow: 'glow-red',    border: 'border-red-500/20',    bg: 'bg-red-500/8',      desc: 'Real-time crowd-sourced map of active scam incidents across Nairobi estates. Know threats before they reach you.', href: '/dashboard/threats' },
  { icon: BookOpen,      name: 'SalamaLearn', tag: 'Security Library',      color: 'text-cyan-400',    glow: 'glow-teal',   border: 'border-cyan-500/20',   bg: 'bg-cyan-500/8',     desc: 'Illustrated security guides covering M-Pesa, SIM-swap, phishing and more — structured for every literacy level.', href: '/dashboard/learn' },
  { icon: AlertTriangle, name: 'SalamaWatch', tag: 'Fraud Reporting',       color: 'text-amber-400',   glow: 'glow-amber',  border: 'border-amber-500/20',  bg: 'bg-amber-500/8',    desc: 'Report scams to protect your community. Verified reports trigger immediate area-wide SalamaAlerts.', href: '/dashboard/report' },
  { icon: Zap,           name: 'SalamaQuiz',  tag: 'Knowledge Quizzes',     color: 'text-yellow-400',  glow: 'glow-amber',  border: 'border-yellow-500/20', bg: 'bg-yellow-500/8',   desc: 'Test your digital safety knowledge with scenario-based quizzes. Earn badges. Track your security score.', href: '/dashboard/quiz' },
  { icon: Bell,          name: 'SalamaAlert', tag: 'Community Alerts',      color: 'text-purple-400',  glow: 'glow-purple', border: 'border-purple-500/20', bg: 'bg-purple-500/8',   desc: 'Severity-ranked fraud alerts for Nairobi areas. Critical threats broadcast instantly via WhatsApp and web.', href: '/dashboard/alerts' },
]

const trustPoints = [
  { icon: Globe,     label: 'No App Download', sub: 'Works in any browser or WhatsApp' },
  { icon: Lock,      label: 'Free to Use',     sub: 'Basic tier fully free, forever' },
  { icon: Users,     label: 'Community-Driven',sub: 'Alerts powered by real reports' },
  { icon: CheckCircle, label: '2G-Compatible', sub: 'Optimised for low-bandwidth Kenya' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  return (
    <div className="min-h-screen relative" style={{background:'#020617'}}>
      <PageBackground variant="landing" />

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="glass border-b border-salama-500/10">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-salama-500 flex items-center justify-center glow-green transition-all group-hover:scale-110">
                <Shield className="w-4 h-4 text-ink-950" />
              </div>
              <span className="font-display font-bold text-lg text-gradient-green">CyberSalama</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[['#features','Features'],['#how','How It Works'],['#trust','Why Us']].map(([href, label]) => (
                <a key={href} href={href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <Link href="/login"    className="hidden sm:flex btn-ghost py-2 px-4 text-sm">Sign in</Link>
              <Link href="/register" className="btn-primary py-2 px-4 text-sm">Get Started <ArrowRight className="w-3.5 h-3.5" /></Link>
              <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="glass border-b border-salama-500/10 md:hidden px-5 pb-4 pt-2 space-y-1">
            {[['#features','Features'],['#how','How It Works'],['#trust','Why Us']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                {label}
              </a>
            ))}
            <div className="pt-2 flex gap-2">
              <Link href="/login"    className="btn-ghost py-2 px-4 text-sm flex-1 text-center">Sign in</Link>
              <Link href="/register" className="btn-primary py-2 px-4 text-sm flex-1 text-center">Register</Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative z-content pt-32 pb-24 px-5">
        {/* Large ambient orb */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-salama-500/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.div style={{ y: heroY }} className="max-w-4xl mx-auto text-center">
          <motion.div variants={stagger} initial="hidden" animate="show">

            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-salama-500/25 text-xs text-salama-400 font-semibold mb-8 tracking-wide">
              <span className="live-dot" />
              Live threat monitoring · Nairobi, Kenya
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6 tracking-tight">
              Your Community&apos;s<br />
              <span className="text-gradient-green">Digital Shield</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              CyberSalama protects Nairobi&apos;s informal markets from M-Pesa fraud, SIM-swap attacks,
              and phishing — via WhatsApp and a full web portal. In Swahili and English. Zero app required.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto">
                Open SalamaHub Free
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/254700000000?text=Hi%20SalamaBot" target="_blank" rel="noopener noreferrer"
                className="btn-ghost px-8 py-3.5 text-base w-full sm:w-auto">
                <MessageSquare className="w-4 h-4 text-salama-400" />
                Try SalamaBot on WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {/* Mock WhatsApp terminal */}
          <motion.div
            initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
            className="mt-16 mx-auto max-w-xl glass-bright rounded-2xl overflow-hidden glow-green text-left"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-salama-500/12 bg-ink-900/60">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-salama-500/70" />
              <div className="ml-3 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-salama-500" />
                <span className="text-xs text-slate-500 font-mono">SalamaBot · WhatsApp</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="live-dot scale-75" />
                <span className="text-xs text-salama-500 font-mono">online</span>
              </div>
            </div>
            <div className="p-5 space-y-3 font-mono text-xs">
              {[
                { from: 'user', text: 'Hi SalamaBot' },
                { from: 'bot',  text: 'Habari! 👋 Welcome to CyberSalama.\n\nChoose language:\n1️⃣ English  2️⃣ Kiswahili' },
                { from: 'user', text: '2' },
                { from: 'bot',  text: '✅ Kiswahili imewekwa.\n\n🚨 TAHADHARI: Mashambulizi ya SIM-swap yameripotiwa Eastleigh. Wasiliana na mtoa wako wa huduma SASA ili kulinda nambari yako.' },
                { from: 'user', text: 'Ninaweza kulinda M-Pesa yangu vipi?' },
                { from: 'bot',  text: '🔐 Hatua 5:\n1. Weka PIN ngumu\n2. Washa 2FA kwenye WhatsApp\n3. Epuka Wi-Fi ya umma\n4. Angalia SMS zako kwa makini\n5. Ripoti kwa *100# ukiona tatizo' },
              ].map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: msg.from === 'user' ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 + i * 0.22, duration: 0.35 }}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`max-w-[75%] px-3.5 py-2 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-salama-500/20 text-salama-100 border border-salama-500/20 rounded-tr-sm'
                      : 'bg-ink-800/80 text-slate-300 border border-ink-700 rounded-tl-sm'
                  }`}>{msg.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────────── */}
      <section className="relative z-content border-y border-salama-500/10">
        <div className="glass py-12">
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            className="max-w-3xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['12+','Nairobi Estates'],['10+','Threat Types'],['2','Languages'],['0','App Downloads']].map(([val,label]) => (
              <div key={label}>
                <div className="font-display font-extrabold text-4xl text-gradient-green mb-1">{val}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="relative z-content py-28 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-16">
            <p className="text-salama-400 text-xs font-semibold tracking-widest uppercase mb-3">Platform Modules</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 tracking-tight">Six tools. One shield.</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Every module is built for low-bandwidth, bilingual, real-world use across Nairobi communities.</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <motion.div key={f.name} variants={fadeUp}>
                <Link href={f.href}
                  className={`group block glass rounded-2xl p-6 border ${f.border} ${f.bg} hover:scale-[1.02] hover:${f.glow} transition-all duration-300`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.bg} border ${f.border}`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`font-display font-bold text-base ${f.color}`}>{f.name}</span>
                    <span className="text-xs text-slate-500">{f.tag}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold ${f.color} group-hover:gap-2 transition-all`}>
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how" className="relative z-content py-24 px-5 border-t border-salama-500/10">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-16">
            <p className="text-salama-400 text-xs font-semibold tracking-widest uppercase mb-3">Two Entry Points</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 tracking-tight">How CyberSalama works</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Globe, title: 'SalamaHub Web Portal', color: 'text-salama-400',
                border: 'border-salama-500/20', steps: [
                  'Visit on any browser — no install, no account required to browse',
                  'Register free to unlock ThreatRadar live map',
                  'Read SalamaLearn guides, filtered by topic and difficulty',
                  'Submit fraud reports via SalamaWatch',
                  'Take SalamaQuiz, earn badges, track your safety score',
                  'Monitor SalamaAlert broadcast feed for your area',
                ]
              },
              {
                icon: MessageSquare, title: 'SalamaBot on WhatsApp', color: 'text-green-400',
                border: 'border-green-500/20', steps: [
                  'Send "Hi" to the CyberSalama WhatsApp number',
                  'Select language — English or Kiswahili',
                  'Receive today\'s security tip automatically each morning',
                  'Ask any cybersecurity question in plain language',
                  'Get area-specific fraud alerts pushed to you instantly',
                  'Report a scam message you received directly via chat',
                ]
              }
            ].map((ch) => (
              <motion.div key={ch.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className={`glass rounded-2xl p-6 border ${ch.border}`}>
                <div className={`flex items-center gap-3 mb-6 ${ch.color}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${ch.border} bg-black/20`}>
                    <ch.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base">{ch.title}</h3>
                </div>
                <ol className="space-y-3">
                  {ch.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${ch.color} bg-ink-800 border border-ink-700 mt-0.5`}>
                        {i + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────── */}
      <section id="trust" className="relative z-content py-20 px-5 border-t border-salama-500/10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl mb-3">Built for Nairobi. Free forever.</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustPoints.map((t) => (
              <motion.div key={t.label} variants={fadeUp}
                className="glass rounded-2xl p-5 text-center border border-salama-500/12 hover:border-salama-500/25 transition-all">
                <div className="w-10 h-10 rounded-xl bg-salama-500/10 border border-salama-500/20 flex items-center justify-center mx-auto mb-3">
                  <t.icon className="w-4.5 h-4.5 text-salama-400" />
                </div>
                <div className="font-semibold text-sm text-white mb-1">{t.label}</div>
                <div className="text-xs text-slate-500">{t.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative z-content py-28 px-5">
        <motion.div initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          className="max-w-2xl mx-auto text-center glass-bright rounded-3xl p-12 border border-salama-500/22 glow-green">
          <div className="w-14 h-14 rounded-2xl bg-salama-500/15 border border-salama-500/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-salama-400" />
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 tracking-tight">
            Start protecting your community
          </h2>
          <p className="text-slate-400 mb-8 text-base">Free. Works on 2G. No app. Available in Kiswahili.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
              Create Free Account <ChevronRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/254700000000?text=Hi%20SalamaBot" target="_blank" rel="noopener noreferrer"
              className="btn-ghost px-8 py-3.5 text-base">
              <MessageSquare className="w-4 h-4" /> Chat SalamaBot
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="relative z-content border-t border-salama-500/10 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-salama-500" />
            <span className="font-display font-semibold text-salama-500 text-sm">CyberSalama</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link href="/login"    className="hover:text-slate-400 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-slate-400 transition-colors">Register</Link>
            <Link href="/dashboard" className="hover:text-slate-400 transition-colors">Portal</Link>
            <a href="https://github.com/TitoKilonzo" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors flex items-center gap-1">GitHub <ExternalLink className="w-2.5 h-2.5" /></a>
          </div>
          <div className="text-xs text-slate-700">
            Built by Tito Kilonzo · SynthLink Technologies · {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  )
}
