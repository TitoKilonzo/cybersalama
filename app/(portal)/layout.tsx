'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, LayoutDashboard, MapPin, BookOpen, AlertTriangle,
  Zap, Bell, LogOut, Menu, X, MessageSquare, ChevronRight,
  Home, User, Settings, ExternalLink
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import PageBackground from '@/components/ui/PageBackground'

type BgVariant = 'landing'|'dashboard'|'threatradar'|'learn'|'watch'|'quiz'|'alert'|'auth'

const ROUTE_CONFIG: Record<string, { bg: BgVariant; accent: string; label: string }> = {
  '/dashboard':          { bg:'dashboard',   accent:'#14b374', label:'SalamaHub' },
  '/dashboard/threats':  { bg:'threatradar', accent:'#ef4444', label:'ThreatRadar' },
  '/dashboard/learn':    { bg:'learn',       accent:'#14b8a6', label:'SalamaLearn' },
  '/dashboard/report':   { bg:'watch',       accent:'#f59e0b', label:'SalamaWatch' },
  '/dashboard/quiz':     { bg:'quiz',        accent:'#fbbf24', label:'SalamaQuiz' },
  '/dashboard/alerts':   { bg:'alert',       accent:'#ef4444', label:'SalamaAlert' },
  '/dashboard/settings': { bg:'dashboard',   accent:'#94a3b8', label:'Settings' },
}

const navItems = [
  { href:'/dashboard',          icon:LayoutDashboard, label:'SalamaHub',   sub:'Overview',      accent:'text-salama-400',  dot:'bg-salama-500' },
  { href:'/dashboard/threats',  icon:MapPin,          label:'ThreatRadar', sub:'Live map',      accent:'text-red-400',     dot:'bg-red-500' },
  { href:'/dashboard/learn',    icon:BookOpen,        label:'SalamaLearn', sub:'Security tips', accent:'text-cyan-400',    dot:'bg-cyan-500' },
  { href:'/dashboard/report',   icon:AlertTriangle,   label:'SalamaWatch', sub:'Report fraud',  accent:'text-amber-400',   dot:'bg-amber-500' },
  { href:'/dashboard/quiz',     icon:Zap,             label:'SalamaQuiz',  sub:'Quizzes',       accent:'text-yellow-400',  dot:'bg-yellow-500' },
  { href:'/dashboard/alerts',   icon:Bell,            label:'SalamaAlert', sub:'Active alerts', accent:'text-purple-400',  dot:'bg-purple-500' },
]

function getConfig(pathname: string) {
  return ROUTE_CONFIG[pathname] ?? Object.entries(ROUTE_CONFIG).find(([k]) => pathname.startsWith(k))?.[1] ?? ROUTE_CONFIG['/dashboard']
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const [userOpen, setUserOpen] = useState(false)

  return (
    <div className="flex flex-col h-full select-none">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{borderBottom:'1px solid rgba(20,179,116,0.1)'}}>
        <Link href="/" className="flex items-center gap-2.5 group" onClick={onNavigate}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
            style={{background:'#14b374',boxShadow:'0 0 16px rgba(20,179,116,0.35)'}}>
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm leading-tight text-gradient-green">CyberSalama</div>
            <div className="text-[10px] text-slate-700 mt-0.5">SalamaHub Portal</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold text-slate-700 uppercase tracking-[0.12em]">Platform</p>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/4'
              }`}
              style={active ? {
                background:'rgba(20,179,116,0.12)',
                border:'1px solid rgba(20,179,116,0.2)',
                color:undefined
              } : {}}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                active ? '' : 'bg-white/4'
              }`} style={active ? {background:'rgba(20,179,116,0.18)'} : {}}>
                <item.icon className={`w-4 h-4 ${active ? item.accent : 'text-slate-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold leading-none mb-0.5 ${active ? item.accent : ''}`}>{item.label}</div>
                <div className="text-[11px] text-slate-700 leading-none">{item.sub}</div>
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-salama-500" />}
            </Link>
          )
        })}

        <div className="pt-4">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-700 uppercase tracking-[0.12em]">Navigation</p>
          <Link href="/dashboard/settings" onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              pathname === '/dashboard/settings' ? 'text-slate-300 bg-white/6' : 'text-slate-500 hover:text-slate-200 hover:bg-white/4'
            }`}>
            <div className="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center flex-shrink-0">
              <Settings className="w-4 h-4 text-slate-600" />
            </div>
            <span>Settings</span>
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-200 hover:bg-white/4 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-slate-600" />
            </div>
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* WhatsApp CTA */}
      <div className="mx-3 mb-3 p-4 rounded-2xl" style={{background:'rgba(20,179,116,0.07)',border:'1px solid rgba(20,179,116,0.14)'}}>
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-salama-400" />
          <span className="text-xs font-bold text-salama-400">SalamaBot</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-salama-500 animate-pulse" />
        </div>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">WhatsApp chatbot — tips & alerts in Swahili or English</p>
        <a href="https://wa.me/254700000000?text=Hi%20SalamaBot" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full text-xs font-bold text-salama-400 py-2 rounded-xl transition-all
            hover:text-white hover:bg-salama-500/15"
          style={{border:'1px solid rgba(20,179,116,0.25)'}}>
          Open WhatsApp <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* User */}
      <div className="px-3 pb-3" style={{borderTop:'1px solid rgba(20,179,116,0.08)'}}>
        <div className="relative pt-3">
          <button onClick={() => setUserOpen(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{background:'rgba(20,179,116,0.18)',border:'1px solid rgba(20,179,116,0.3)'}}>
              <User className="w-4 h-4 text-salama-400" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs font-semibold text-slate-300 truncate">My Account</div>
              <div className="text-[10px] text-slate-600">SalamaHub</div>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-700 flex-shrink-0 transition-transform ${userOpen?'rotate-90':''}`} />
          </button>
          <AnimatePresence>
            {userOpen && (
              <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:4}}
                className="absolute bottom-full left-0 right-0 mb-1 rounded-xl overflow-hidden"
                style={{background:'rgba(15,23,42,0.95)',border:'1px solid rgba(20,179,116,0.15)',backdropFilter:'blur(16px)'}}>
                <button onClick={() => signOut({ callbackUrl:'/' })}
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
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const config = getConfig(pathname)

  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#020617'}}>

      {/* ── Animated background layer (BELOW everything, no stacking context issues) */}
      <PageBackground variant={config.bg} />

      {/* ── Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 relative z-20"
        style={{background:'rgba(8,14,28,0.82)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(20,179,116,0.10)'}}>
        <SidebarContent pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* ── Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{x:-280}} animate={{x:0}} exit={{x:-280}}
              transition={{type:'spring',damping:26,stiffness:220}}
              className="fixed inset-y-0 left-0 w-72 z-50 md:hidden flex flex-col"
              style={{background:'rgba(8,14,28,0.95)',backdropFilter:'blur(24px)',borderRight:'1px solid rgba(20,179,116,0.12)'}}>
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/8 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 md:px-6 h-14 flex-shrink-0"
          style={{background:'rgba(8,14,28,0.75)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(20,179,116,0.08)'}}>
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/6 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
              <LayoutDashboard className="w-4 h-4" />
            </Link>
            {pathname !== '/dashboard' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" />
                <span className="font-semibold text-sm truncate" style={{color: config.accent}}>
                  {config.label}
                </span>
              </>
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-salama-400"
              style={{border:'1px solid rgba(20,179,116,0.2)',background:'rgba(20,179,116,0.07)'}}>
              <span className="w-1.5 h-1.5 rounded-full bg-salama-500 animate-pulse" />
              <span className="hidden lg:inline">Live</span>
            </div>
            <Link href="/dashboard/alerts" className="relative p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" style={{border:'2px solid #020617'}} />
            </Link>
            <Link href="/dashboard/settings" className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-white/5 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={pathname}
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                transition={{duration:0.25,ease:'easeOut'}}>
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
