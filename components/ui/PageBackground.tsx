'use client'

import { useEffect, useRef } from 'react'

type BgVariant = 'landing' | 'dashboard' | 'threatradar' | 'learn' | 'watch' | 'quiz' | 'alert' | 'auth'

interface Props { variant: BgVariant; className?: string }

// Particle canvas for landing
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const pts = Array.from({length:55}, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random()*1.3+0.3, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, a:Math.random()*.45+.08
    }))
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for (const p of pts) {
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(20,179,116,${p.a})`; ctx.fill()
      }
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<130){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y)
          ctx.strokeStyle=`rgba(20,179,116,${.055*(1-d/130)})`; ctx.lineWidth=.5; ctx.stroke()}
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:1}} />
}

export default function PageBackground({ variant, className='' }: Props) {
  const base = "fixed inset-0 pointer-events-none"

  if (variant === 'landing') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0}}>
      {/* Cyber grid */}
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(20,179,116,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(20,179,116,0.04) 1px,transparent 1px)',
        backgroundSize:'60px 60px', animation:'gridDrift 40s linear infinite'
      }}/>
      {/* Radial glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
        style={{background:'radial-gradient(ellipse,rgba(20,179,116,0.10) 0%,transparent 70%)', animation:'orbitGlow 20s ease-in-out infinite alternate'}}/>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{background:'radial-gradient(ellipse,rgba(20,184,166,0.07) 0%,transparent 70%)'}}/>
      <ParticleCanvas />
    </div>
  )

  if (variant === 'threatradar') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0, background:'radial-gradient(ellipse at center,#060e0a 0%,#020617 70%)'}}>
      {/* Radar sweep */}
      <div className="absolute top-1/2 left-1/2 w-[140vmax] h-[140vmax]"
        style={{transform:'translate(-50%,-50%)',
          background:'conic-gradient(from 0deg,transparent 0deg,transparent 342deg,rgba(20,179,116,0.04) 346deg,rgba(20,179,116,0.14) 356deg,rgba(20,179,116,0.03) 360deg)',
          animation:'radarSweep 6s linear infinite'}}/>
      {/* Concentric rings */}
      {[25,42,60].map((r,i) => (
        <div key={i} className="absolute top-1/2 left-1/2 rounded-full border"
          style={{width:`${r}vmin`,height:`${r}vmin`,transform:'translate(-50%,-50%)',borderColor:`rgba(20,179,116,${0.07-i*0.015})`}}/>
      ))}
      {/* Green tint */}
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 100%,rgba(20,179,116,0.06) 0%,transparent 60%)'}}/>
    </div>
  )

  if (variant === 'learn') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0, background:'linear-gradient(160deg,#020c1b 0%,#020617 50%,#021208 100%)'}}>
      <div className="absolute inset-0" style={{
        backgroundImage:'radial-gradient(circle,rgba(20,184,166,0.055) 1px,transparent 1px)',
        backgroundSize:'38px 38px', animation:'nodeFloat 18s ease-in-out infinite alternate'
      }}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 10% 50%,rgba(20,184,166,0.08) 0%,transparent 40%)'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 90% 20%,rgba(20,179,116,0.07) 0%,transparent 35%)'}}/>
    </div>
  )

  if (variant === 'watch') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0, background:'linear-gradient(160deg,#100900 0%,#020617 60%)'}}>
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(245,158,11,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.025) 1px,transparent 1px)',
        backgroundSize:'50px 50px'
      }}/>
      <div className="absolute -bottom-1/4 -right-1/4 rounded-full border"
        style={{width:'80vmax',height:'80vmax',borderColor:'rgba(245,158,11,0.05)',
          boxShadow:'0 0 0 40px rgba(245,158,11,0.02),0 0 0 80px rgba(245,158,11,0.01)',
          animation:'warningPulse 4s ease-in-out infinite'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 100% 100%,rgba(245,158,11,0.07) 0%,transparent 40%)'}}/>
    </div>
  )

  if (variant === 'quiz') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0, background:'linear-gradient(135deg,#06010f 0%,#020617 50%,#030a14 100%)'}}>
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(250,204,21,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.025) 1px,transparent 1px)',
        backgroundSize:'44px 44px'
      }}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at 20% 20%,rgba(250,204,21,0.05) 0%,transparent 45%)', animation:'quizPulse 5s ease-in-out infinite alternate'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(circle at 80% 80%,rgba(139,92,246,0.05) 0%,transparent 45%)'}}/>
    </div>
  )

  if (variant === 'alert') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0, background:'linear-gradient(160deg,#110506 0%,#020617 60%)'}}>
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[100vmax] h-[100vmax]"
        style={{background:'conic-gradient(from 0deg,transparent 0deg,rgba(239,68,68,0.04) 10deg,transparent 20deg)',
          animation:'alertBeacon 4s linear infinite'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 0%,rgba(239,68,68,0.08) 0%,transparent 50%)'}}/>
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(239,68,68,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(239,68,68,0.02) 1px,transparent 1px)',
        backgroundSize:'50px 50px'
      }}/>
    </div>
  )

  if (variant === 'auth') return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0}}>
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(20,179,116,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(20,179,116,0.04) 1px,transparent 1px)',
        backgroundSize:'80px 80px'
      }}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 0% 100%,rgba(20,179,116,0.10) 0%,transparent 45%)'}}/>
      <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 100% 0%,rgba(20,184,166,0.07) 0%,transparent 40%)'}}/>
    </div>
  )

  // dashboard (default)
  return (
    <div className={`${base} overflow-hidden`} style={{zIndex:0}}>
      <div className="absolute inset-0" style={{
        backgroundImage:'linear-gradient(rgba(20,179,116,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(20,179,116,0.03) 1px,transparent 1px)',
        backgroundSize:'48px 48px'
      }}/>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full"
        style={{background:'radial-gradient(ellipse,rgba(20,179,116,0.05) 0%,transparent 70%)'}}/>
    </div>
  )
}
