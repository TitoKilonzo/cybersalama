'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, LayoutDashboard, MapPin, BookOpen, AlertTriangle,
  Zap, Bell, LogOut, Menu, X, MessageSquare, ChevronRight,
  Home, User, ExternalLink, Settings
} from 'lucide-react'
import { signOut } from 'next-auth/react'

/* Per-page background + accent config ─────────────────────────────── */
const PAGE_CONFIG: Record<string, { bgClass: string; accent: string; label: string }> = {
  '/dashboard':         { bgClass: 'bg-dashboard',   accent: '#14b374', label: 'SalamaHub' },
  '/dashboard/threats': { bgClass: 'bg-threatradar', accent: '#ef4444', label: 'ThreatRadar' },
  '/dashboard/learn':   { bgClass: 'bg-learn',       accent: '#14b8a6', label: 'SalamaLearn' },
  '/dashboard/report':  { bgClass: 'bg-watch',       accent: '#f59e0b', label: 'SalamaWatch' },
  '/dashboard/quiz':    { bgClass: 'bg-quiz',        accent: '#fbbf24', label: 'SalamaQuiz' },
  '/dashboard/alerts':  { bgClass: 'bg-alert',       accent: '#ef4444', label: 'SalamaAlert' },
  '/dashboard/settings':{ bgClass: 'bg-dashboard',  accent: '#94a3b8', label: 'Settings' },
}

const navItems = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'SalamaHub',   sub: 'Overview',      accent: 'text-salama-400' },
  { href: '/dashboard/threats',  icon: MapPin,          label: 'ThreatRadar', sub: 'Live map',      accent: 'text-red-400' },
  { href: '/dashboard/learn',    icon: BookOpen,        label: 'SalamaLearn', sub: 'Security tips', accent: 'text-cyan-400' },
  { href: '/dashboard/report',   icon: AlertTriangle,   label: 'SalamaWatch', sub: 'Report fraud',  accent: 'text-amber-400' },
  { href: '/dashboard/quiz',     icon: Zap,             label: 'SalamaQuiz',  sub: 'Quizzes',       accent: 'text-yellow-400' },
  { href: '/dashboard/alerts',   icon: Bell,            label: 'SalamaAlert', sub: 'Alerts',        accent: 'text-purple-400' },
]

function getBgClass(pathname: string) {
  // exact then prefix match
  return PAGE_CONFIG[pathname]?.bgClass ?? PAGE_CONFIG[Object.keys(PAGE_CONFIG).find(k => pathname.startsWith(k)) ?? '']?.bgClass ?? 'bg-dashboard'
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const bgClass = getBgClass(pathname)
  const pageConf = PAGE_CONFIG[pathname] ?? Object.values(PAGE_CONFIG)[0]

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo ─────────────────────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-salama-500/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-salama-500 flex items-center justify-center glow-green flex-shrink-0 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 text-ink-950" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-gradient-green leading-tight">CyberSalama</div>
            <div className="text-slate-600 text-[10px] mt-0.5 leading-none">SalamaHub Portal</div>
          </div>
        </Link>
      </div>

      {/* Nav ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold text-slate-700 uppercase tracking-widest">Platform</p>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`nav-item ${active ? 'active' : ''}`}>
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? item.accent : 'text-slate-600 group-hover:text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium leading-none mb-0.5 ${active ? item.accent : ''}`}>{item.label}</div>
                <div className="text-[11px] text-slate-600 leading-none">{item.sub}</div>
              </div>
              {active && <ChevronRight className="w-3 h-3 text-salama-500 flex-shrink-0" />}
            </Link>
          )
        })}

        {/* Back to home */}
        <div className="pt-3">
          <p className="px-3 pb-2 text-[10px] font-semibold text-slate-700 uppercase tracking-widest">Navigation</p>
          <Link href="/" className="nav-item">
            <Home className="w-4 h-4 text-slate-600" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* WhatsApp CTA ─────────────────────────────────────────────── */}
      <div className="mx-3 mb-3 p-3.5 rounded-xl bg-salama-500/7 border border-salama-500/14">
        <div className="flex items-center gap-2 mb-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-salama-400" />
          <span className="text-xs font-semibold text-salama-400">SalamaBot</span>
        </div>
        <p className="text-xs text-slate-500 mb-2.5 leading-snug">Try the WhatsApp chatbot for mobile alerts in Swahili or English</p>
        <a href="https://wa.me/254700000000?text=Hi%20SalamaBot" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-salama-400
                     border border-salama-500/25 rounded-lg py-2 hover:bg-salama-500/10 transition-colors">
          Open WhatsApp <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* User block ─────────────────────────────────────────────── */}
      <div className="border-t border-salama-500/10 px-3 py-3">
        <div className="relative">
          <button onClick={() => setUserMenuOpen(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-salama-500/20 border border-salama-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-salama-400" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">My Account</div>
              <div className="text-[10px] text-slate-600 truncate">SalamaHub user</div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }}
                className="absolute bottom-full left-0 right-0 mb-1 glass-bright rounded-xl border border-salama-500/15 overflow-hidden">
                <button onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex h-screen overflow-hidden ${bgClass}`}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 glass border-r border-salama-500/10 relative z-20">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type:'spring', damping:26, stiffness:220 }}
              className="fixed inset-y-0 left-0 w-72 z-50 glass border-r border-salama-500/10 md:hidden flex flex-col">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-ink-800 text-slate-500">
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Top bar ───────────────────────────────────────────────── */}
        <header className="flex items-center gap-3 px-5 h-14 border-b border-salama-500/10 glass flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            <Link href="/dashboard" className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
              <LayoutDashboard className="w-3.5 h-3.5" />
            </Link>
            {pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-700 flex-shrink-0" />
                <span className="font-medium truncate" style={{ color: pageConf?.accent ?? '#14b374' }}>
                  {pageConf?.label ?? 'Portal'}
                </span>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-salama-500/20 bg-salama-500/7 text-xs text-salama-400 font-medium">
              <span className="live-dot" />
              Live
            </div>
            <Link href="/dashboard/alerts"
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-ink-900" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <AnimatePresence mode="wait">
            <motion.div key={pathname}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.28, ease:'easeOut' }}
              className="relative z-content">
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
