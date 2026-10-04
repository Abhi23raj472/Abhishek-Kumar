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
      duration: 1.5,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => setTimeout(onDone, 250),
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
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0a0b0d] p-6 text-[#eceef1] md:p-10"
      exit={{ y: '-100%', borderBottomLeftRadius: '50% 12%', borderBottomRightRadius: '50% 12%' }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] opacity-70">
        <span>Abhishek Kumar</span>
        <span>Quality Engineer</span>
      </div>
      <div>
        <div className="h-6 overflow-hidden font-mono text-sm">
          <motion.div key={step} initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.35, ease }}>
            <span className={pct === 100 ? 'text-lime' : ''}>{pct === 100 ? '✓' : '›'}</span> {checks[step]}
          </motion.div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-6">
          <div className="h-[2px] flex-1 overflow-hidden bg-white/15">
            <div className="h-full origin-left bg-lime" style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <span className="font-display text-[clamp(4rem,14vw,10rem)] font-semibold leading-[0.8] tracking-[-0.05em] tabular-nums">
            {pct}
            <span className="text-lime">%</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
