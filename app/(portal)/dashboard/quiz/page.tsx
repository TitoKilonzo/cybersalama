'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft, Star, Lock } from 'lucide-react'

const quizzes = [
  { id:'q1', titleEn:'M-Pesa Safety Basics', category:'M-PESA SAFETY', difficulty:'BEGINNER', points:10, color:'text-salama-400', bg:'bg-salama-500/10', border:'border-salama-500/20',
    questions:[
      { q:'You receive an SMS saying "Your M-Pesa will be suspended. Call 0700111222 immediately." What should you do?',
        opts:['Call the number immediately — sounds urgent','Ignore it — Safaricom never does this via SMS','Send your PIN to verify your account','Forward the SMS to all contacts'],
        correct:1, exp:'Safaricom never threatens account suspension via unsolicited SMS. This is a classic phishing attempt. Ignore it and optionally report the number to Safaricom on 0722 002 100.' },
      { q:'How often should you change your M-Pesa PIN?',
        opts:['Never — too much work','Every 3–6 months','Only when you forget it','Every single day'],
        correct:1, exp:'Best practice is every 3 to 6 months. Dial *234*1# to change your M-Pesa PIN at any time.' },
      { q:'A "Safaricom employee" calls asking for your M-Pesa PIN to fix your account. What is correct?',
        opts:['Share it — they work for Safaricom','Share only the first 2 digits','Never share your PIN with anyone, including Safaricom staff','Ask for their employee ID then share'],
        correct:2, exp:'Safaricom employees will NEVER ask for your PIN over the phone. Sharing it with anyone — regardless of who they claim to be — puts your money at risk.' },
    ]},
  { id:'q2', titleEn:'SIM Swap Awareness', category:'SIM SWAP', difficulty:'INTERMEDIATE', points:20, color:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/20',
    questions:[
      { q:'Your phone suddenly has no signal and you cannot send SMS or make calls. First thing to do?',
        opts:['Restart your phone and wait for an hour','Call your telecom immediately from another phone','Go buy a new SIM card','Post about it on social media'],
        correct:1, exp:'Sudden complete loss of signal is the #1 sign of a SIM swap attack. Calling your telecom immediately from a different phone can freeze the fraudulent SIM before any damage is done.' },
      { q:'Which best protects you from SIM swap fraud?',
        opts:['Using a complicated phone password','Setting a SIM PIN (separate from M-Pesa PIN)','Having a backup phone','Avoiding mobile banking entirely'],
        correct:1, exp:'A SIM PIN (set in Settings > SIM card security) requires a PIN to use the SIM even in a new phone, making SIM swap fraud significantly harder.' },
    ]},
  { id:'q3', titleEn:'Phishing Defence', category:'PHISHING', difficulty:'BEGINNER', points:10, color:'text-cyan-400', bg:'bg-cyan-500/10', border:'border-cyan-500/20',
    questions:[
      { q:'Which of these is a red flag that an SMS is a phishing attempt?',
        opts:['It comes from your bank\'s official short code','It contains a bit.ly shortened link','It shows your name correctly','It was sent during business hours'],
        correct:1, exp:'Bit.ly and other URL shorteners in financial SMS are a major red flag — they hide the real destination. Legitimate banks and Safaricom use their own domains in links.' },
      { q:'A link in an SMS says "www.safaricom-ke.verify-account.com". Is this legitimate?',
        opts:['Yes — it mentions Safaricom','No — the real domain is safaricom.co.ke, not verify-account.com','Yes — it looks official','Not sure, just click it to check'],
        correct:1, exp:'The actual domain here is "verify-account.com" — "safaricom-ke" is just a subdomain prefix. Always check the main domain after the last dot before the path. Safaricom\'s real domain is safaricom.co.ke.' },
    ]},
]

const diffColor: Record<string, string> = {
  BEGINNER:     'text-salama-400 bg-salama-500/10 border-salama-500/20',
  INTERMEDIATE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  ADVANCED:     'text-red-400 bg-red-500/10 border-red-500/20',
}

type Phase = 'list' | 'quiz' | 'result'

export default function SalamaQuizPage() {
  const [phase,       setPhase]       = useState<Phase>('list')
  const [activeQuiz,  setActiveQuiz]  = useState<typeof quizzes[0]|null>(null)
  const [current,     setCurrent]     = useState(0)
  const [selected,    setSelected]    = useState<number|null>(null)
  const [answers,     setAnswers]     = useState<boolean[]>([])
  const [showExplain, setShowExplain] = useState(false)

  function startQuiz(q: typeof quizzes[0]) {
    setActiveQuiz(q); setPhase('quiz'); setCurrent(0); setSelected(null); setAnswers([]); setShowExplain(false)
  }

  function handleAnswer(idx: number) {
    if (selected !== null) return
    setSelected(idx); setShowExplain(true)
    setAnswers(a => [...a, idx === activeQuiz!.questions[current].correct])
  }

  function next() {
    if (current + 1 < activeQuiz!.questions.length) {
      setCurrent(c => c+1); setSelected(null); setShowExplain(false)
    } else {
      setPhase('result')
    }
  }

  if (phase === 'list') return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/12 border border-yellow-500/20 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-yellow-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">SalamaQuiz</h1>
        </div>
        <p className="text-slate-500 text-sm">Test your cybersecurity knowledge. Earn points and badges.</p>
      </div>

      {/* Score bar */}
      <div className="glass rounded-2xl border border-yellow-500/15 p-5 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/12 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <Star className="w-7 h-7 text-yellow-400" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-400 mb-1">Your quiz score</div>
          <div className="font-display font-extrabold text-3xl text-gradient-gold leading-none">0 pts</div>
        </div>
        <div className="text-xs text-slate-600 text-right">
          <div>0 / {quizzes.length} completed</div>
          <div className="mt-1">0 badges earned</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(q => (
          <motion.div key={q.id} whileHover={{ y:-2 }}
            className={`glass rounded-2xl border p-5 ${q.border} ${q.bg} flex flex-col`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
              <span className={`text-xs font-medium ${q.color}`}>{q.category}</span>
            </div>
            <h3 className="font-display font-semibold text-base text-white mb-1 flex-1">{q.titleEn}</h3>
            <p className="text-xs text-slate-600 mb-4">{q.questions.length} questions · +{q.points} pts</p>
            <button onClick={() => startQuiz(q)} className="btn-primary w-full py-2.5 text-xs gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Start Quiz
            </button>
          </motion.div>
        ))}
        {/* Coming soon card */}
        <div className="glass rounded-2xl border border-white/5 p-5 flex flex-col items-center justify-center text-center opacity-40">
          <Lock className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-sm text-slate-600 font-medium">More quizzes coming soon</p>
          <p className="text-xs text-slate-700 mt-1">Advanced SIM Swap, Social Media, Data Privacy</p>
        </div>
      </div>
    </div>
  )

  if (phase === 'result') {
    const score  = answers.filter(Boolean).length
    const total  = activeQuiz!.questions.length
    const passed = score >= Math.ceil(total * 0.7)
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', damping:14 }}>
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-salama-500/15 border border-salama-500/30 glow-green' : 'bg-red-500/15 border border-red-500/30'}`}>
            {passed ? <Trophy className="w-12 h-12 text-salama-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
          </div>
          <h2 className={`font-display font-bold text-3xl mb-2 ${passed ? 'text-gradient-green' : 'text-gradient-red'}`}>
            {passed ? 'Excellent work!' : 'Keep learning!'}
          </h2>
          <div className="text-5xl font-display font-extrabold mb-2">
            <span className="text-white">{score}</span>
            <span className="text-slate-600">/{total}</span>
          </div>
          <p className="text-slate-400 mb-1">{passed ? `+${activeQuiz!.points} points earned 🎉` : 'Review the tips and try again'}</p>
          <p className="text-slate-600 text-sm mb-8">Score: {Math.round((score/total)*100)}%</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => startQuiz(activeQuiz!)} className="btn-ghost gap-2">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button onClick={() => setPhase('list')} className="btn-primary gap-2">
              All Quizzes
            </button>
          </div>
          <Link href="/dashboard/learn" className="block mt-5 text-sm text-salama-400 hover:text-salama-300 transition-colors">
            Read SalamaLearn tips to improve →
          </Link>
        </motion.div>
      </div>
    )
  }

  // Active quiz
  const q       = activeQuiz!.questions[current]
  const total   = activeQuiz!.questions.length
  const progress = ((current) / total) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setPhase('list')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Exit quiz
        </button>
        <span className={`text-xs font-semibold ${activeQuiz!.color}`}>{activeQuiz!.titleEn}</span>
        <span className="text-xs text-slate-600">{current+1} / {total}</span>
      </div>

      {/* Progress */}
      <div className="w-full bg-ink-800/80 rounded-full h-1.5 overflow-hidden">
        <motion.div initial={{ width:0 }} animate={{ width:`${progress}%`}} transition={{ duration:0.4 }}
          className="h-full rounded-full bg-salama-500" />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
          transition={{ duration:0.25 }}
          className="glass rounded-2xl border border-salama-500/14 p-6">
          <p className="text-base font-medium text-white leading-relaxed mb-6">{q.q}</p>
          <div className="space-y-2.5">
            {q.opts.map((opt, i) => {
              let cls = 'border-white/8 text-slate-300 hover:border-white/18 hover:bg-white/4 cursor-pointer'
              if (selected !== null) {
                if (i === q.correct)                    cls = 'border-salama-500 bg-salama-500/14 text-salama-200 cursor-default'
                else if (i === selected && i !== q.correct) cls = 'border-red-500 bg-red-500/12 text-red-300 cursor-default'
                else                                    cls = 'border-white/4 text-slate-600 opacity-40 cursor-default'
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all leading-snug ${cls}`}>
                  <span className="font-mono text-xs mr-3 opacity-50">{String.fromCharCode(65+i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {showExplain && (
              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                className="mt-5 overflow-hidden">
                <div className="p-4 rounded-xl bg-ink-900/80 border border-white/7">
                  <div className="flex items-center gap-2 mb-2">
                    {selected === q.correct
                      ? <CheckCircle className="w-4 h-4 text-salama-400" />
                      : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className={`text-xs font-semibold ${selected === q.correct ? 'text-salama-400' : 'text-red-400'}`}>
                      {selected === q.correct ? 'Correct!' : `Incorrect — correct answer: ${String.fromCharCode(65+q.correct)}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{q.exp}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {selected !== null && (
        <motion.button initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          onClick={next} className="btn-primary w-full py-3.5">
          {current + 1 < total ? 'Next Question →' : 'See Results'}
        </motion.button>
      )}
    </div>
  )
}
