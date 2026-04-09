'use client'
import Link from 'next/link'
import { Shield, Home, ArrowLeft } from 'lucide-react'
export default function NotFound() {
  return (
    <div className="bg-auth min-h-screen flex items-center justify-center px-5">
      <div className="relative z-10 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-salama-500/12 border border-salama-500/25 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-salama-400" />
        </div>
        <div className="font-display font-extrabold text-8xl text-gradient-green mb-2 leading-none">404</div>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Page not found</h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-ghost gap-2 text-sm py-2.5">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/dashboard" className="btn-primary gap-2 text-sm py-2.5">
            <ArrowLeft className="w-4 h-4" /> SalamaHub
          </Link>
        </div>
      </div>
    </div>
  )
}
