'use client'

import { useState } from 'react'
import { Zap, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react'

const quizzes = [
  {
    id: 'q1',
    titleEn: 'M-Pesa Safety Basics',
    titleSw: 'Misingi ya Usalama wa M-Pesa',
    category: 'MPESA_SAFETY',
    difficulty: 'BEGINNER',
    points: 10,
    questions: [
      {
        questionEn: 'You receive an SMS saying "Your M-Pesa account will be suspended. Call 0700111222 immediately." What should you do?',
        optionsEn: [
          'Call the number immediately — it sounds urgent',
          'Ignore it — Safaricom never suspends accounts via SMS like this',
          'Send your PIN to the number to verify your account',
          'Forward the SMS to all your contacts to warn them',
        ],
        correctIndex: 1,
        explanationEn: 'Safaricom never threatens account suspension via unsolicited SMS. This is a phishing attempt. The correct action is to ignore it and optionally report it to Safaricom on 0722 002 100.',
      },
      {
        questionEn: 'How often should you change your M-Pesa PIN?',
        optionsEn: ['Never — it is too much work', 'Every 3–6 months', 'Only when you forget it', 'Every day'],
        correctIndex: 1,
        explanationEn: 'Best practice is to change your PIN every 3 to 6 months to reduce the risk of it being compromised. Use *234*1# to change your M-Pesa PIN.',
      },
      {
        questionEn: 'A "Safaricom employee" calls and says they need your M-Pesa PIN to fix your account. What is correct?',
        optionsEn: [
          'Share the PIN — they work for Safaricom',
          'Share only the first 2 digits to verify',
          'Never share your PIN with anyone, including people claiming to be Safaricom',
          'Ask for their employee ID then share it',
        ],
        correctIndex: 2,
        explanationEn: 'Safaricom employees will NEVER ask for your PIN over the phone. Sharing it with anyone is dangerous regardless of who they claim to be.',
      },
    ],
  },
  {
    id: 'q2',
    titleEn: 'SIM Swap Awareness',
    titleSw: 'Ufahamu wa Udanganyifu wa SIM Swap',
    category: 'SIM_SWAP',
    difficulty: 'INTERMEDIATE',
    points: 20,
    questions: [
      {
        questionEn: 'Your phone suddenly has no signal and you cannot make calls or receive SMS. What is the FIRST thing you should do?',
        optionsEn: [
          'Restart your phone and wait',
          'Immediately call your telecom from another phone to report a possible SIM swap',
          'Go buy a new SIM card',
          'Post about it on social media',
        ],
        correctIndex: 1,
        explanationEn: 'Sudden loss of signal on your phone is a classic sign of SIM swap fraud. Immediately calling your telecom from a different phone can freeze the fraudulent SIM before damage is done.',
      },
      {
        questionEn: 'Which of these best protects you from SIM swap fraud?',
        optionsEn: [
          'Using a complicated phone password',
          'Setting up a SIM PIN (separate from your M-Pesa PIN)',
          'Having a backup phone',
          'Not using mobile banking',
        ],
        correctIndex: 1,
        explanationEn: 'A SIM PIN (set via your phone\'s Settings > SIM card security) requires a PIN to use the SIM even if it is inserted in another phone, making SIM swap fraud much harder.',
      },
    ],
  },
]

const difficultyColor: Record<string, string> = {
  BEGINNER:     'text-salama-400 bg-salama-500/10 border-salama-500/20',
  INTERMEDIATE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  ADVANCED:     'text-red-400 bg-red-500/10 border-red-500/20',
}

type Phase = 'list' | 'quiz' | 'result'

export default function SalamaQuizPage() {
  const [phase,       setPhase]       = useState<Phase>('list')
  const [activeQuiz,  setActiveQuiz]  = useState<typeof quizzes[0] | null>(null)
  const [current,     setCurrent]     = useState(0)
  const [selected,    setSelected]    = useState<number | null>(null)
  const [answers,     setAnswers]     = useState<{ correct: boolean }[]>([])
  const [showExplain, setShowExplain] = useState(false)

  function startQuiz(q: typeof quizzes[0]) {
    setActiveQuiz(q); setPhase('quiz'); setCurrent(0); setSelected(null); setAnswers([]); setShowExplain(false)
  }

  function handleAnswer(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setShowExplain(true)
    const correct = idx === activeQuiz!.questions[current].correctIndex
    setAnswers((a) => [...a, { correct }])
  }

  function next() {
    const total = activeQuiz!.questions.length
    if (current + 1 < total) {
      setCurrent((c) => c + 1); setSelected(null); setShowExplain(false)
    } else {
      setPhase('result')
    }
  }

  if (phase === 'list') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h1 className="font-display font-bold text-2xl text-white">SalamaQuiz</h1>
          </div>
          <p className="text-ink-400 text-sm">Test your cybersecurity knowledge. Earn points and badges.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {quizzes.map((q) => (
            <div key={q.id} className="glass rounded-xl border border-salama-500/15 p-5 hover:border-salama-500/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor[q.difficulty]}`}>{q.difficulty}</span>
                <span className="text-xs text-ink-500">{q.category.replace(/_/g, ' ')}</span>
              </div>
              <h3 className="font-display font-semibold text-base text-ink-100 mb-1">{q.titleEn}</h3>
              <p className="text-xs text-ink-500 mb-4">{q.questions.length} questions · {q.points} points</p>
              <button onClick={() => startQuiz(q)} className="btn-primary w-full py-2 text-sm">
                <Zap className="w-3.5 h-3.5" /> Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const score = answers.filter((a) => a.correct).length
    const total = activeQuiz!.questions.length
    const passed = score >= Math.ceil(total * 0.7)
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-salama-500/20 border-salama-500/30 glow-green' : 'bg-red-500/20 border-red-500/30'} border`}>
          {passed ? <Trophy className="w-10 h-10 text-salama-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
        </div>
        <h2 className={`font-display font-bold text-3xl mb-2 ${passed ? 'text-gradient-green' : 'text-red-400'}`}>
          {passed ? 'Well done!' : 'Keep learning!'}
        </h2>
        <p className="text-ink-300 text-lg mb-1">You scored <strong className="text-white">{score}/{total}</strong></p>
        <p className="text-ink-500 text-sm mb-8">{passed ? `+${activeQuiz!.points} points earned 🎉` : 'Review the tips and try again'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => startQuiz(activeQuiz!)} className="btn-ghost gap-2">
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
          <button onClick={() => setPhase('list')} className="btn-primary gap-2">
            All Quizzes
          </button>
        </div>
      </div>
    )
  }

  // Active quiz
  const q = activeQuiz!.questions[current]
  const total = activeQuiz!.questions.length
  const progress = ((current) / total) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span>{activeQuiz!.titleEn}</span>
          <span>Question {current + 1} of {total}</span>
        </div>
        <div className="w-full bg-ink-800 rounded-full h-1.5">
          <div className="bg-salama-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="glass rounded-xl border border-salama-500/15 p-6">
        <p className="text-base font-medium text-ink-100 leading-relaxed mb-6">{q.questionEn}</p>
        <div className="space-y-3">
          {q.optionsEn.map((opt, i) => {
            let style = 'border-ink-700 text-ink-300 hover:border-ink-500'
            if (selected !== null) {
              if (i === q.correctIndex) style = 'border-salama-500 bg-salama-500/15 text-salama-300'
              else if (i === selected && i !== q.correctIndex) style = 'border-red-500 bg-red-500/15 text-red-300'
              else style = 'border-ink-800 text-ink-600 opacity-50'
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all leading-snug ${style}`}
              >
                <span className="font-mono text-xs mr-3 opacity-60">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplain && (
          <div className="mt-5 p-4 rounded-xl bg-ink-900 border border-ink-700">
            <div className="flex items-center gap-2 mb-2">
              {selected === q.correctIndex
                ? <CheckCircle className="w-4 h-4 text-salama-400" />
                : <XCircle className="w-4 h-4 text-red-400" />
              }
              <span className={`text-xs font-semibold ${selected === q.correctIndex ? 'text-salama-400' : 'text-red-400'}`}>
                {selected === q.correctIndex ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed">{q.explanationEn}</p>
          </div>
        )}
      </div>

      {selected !== null && (
        <button onClick={next} className="btn-primary w-full py-3">
          {current + 1 < total ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </div>
  )
}
