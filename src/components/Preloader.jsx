import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { ease } from '../lib/motion'

const checks = ['Loading test suites', 'Running regression', 'Validating APIs', 'All checks passed']

/** Short intro: a test run counts to 100%, then the curtain lifts. */
export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const c = animate(0, 100, {
      duration: 1.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => setTimeout(onDone, 200),
    })
    return () => {
      c.stop()
      document.body.style.overflow = ''
    }
  }, [onDone])

  const step = pct === 100 ? checks.length - 1 : Math.min(checks.length - 2, Math.floor(pct / 34))

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0c0c0d] p-6 text-[#ececee] md:p-10"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
        <span>Abhishek Kumar</span>
        <span>Quality Engineer</span>
      </div>
      <div aria-hidden className="-mx-6 overflow-hidden whitespace-nowrap md:-mx-10">
        <motion.div
          className="flex w-max text-[clamp(2rem,6vw,4.5rem)] font-semibold tracking-[-0.03em] text-white/10"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((k) => (
            <span key={k} className="pr-8">
              Quality Engineer — Test Automation — Tricentis Tosca — API Validation —&nbsp;
            </span>
          ))}
        </motion.div>
      </div>
      <div>
        <div className="h-5 overflow-hidden font-mono text-xs text-white/70">
          <motion.div key={step} initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.35, ease }}>
            {pct === 100 ? '✓' : '›'} {checks[step]}
          </motion.div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-6">
          <div className="h-px flex-1 overflow-hidden bg-white/15">
            <div className="h-full origin-left bg-white" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <span className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
            {pct}
            <span className="text-white/40">%</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
