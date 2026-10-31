import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { ease } from '../lib/motion'

const checks = ['Systems check', 'Running regression', 'Validating APIs', 'Go for launch']

/**
 * Launch countdown over the sky. The overlay is see-through, so the Earth's
 * limb shows behind it; when the count reaches zero it lifts away and the
 * camera rises into orbit.
 */
export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const c = animate(0, 100, {
      duration: 1.2,
      ease: [0.45, 0, 0.25, 1],
      onUpdate: (v) => setPct(v),
      onComplete: () => setTimeout(onDone, 150),
    })
    // Browsers pause animation frames in background tabs; a plain timer still fires.
    const backup = setTimeout(onDone, 2500)
    return () => {
      c.stop()
      clearTimeout(backup)
      document.body.style.overflow = ''
    }
  }, [onDone])

  const step = Math.min(checks.length - 1, Math.floor(pct / 25))
  const t = Math.max(0, Math.ceil(10 - pct / 10))

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className="preloader-bg fixed inset-0 z-[100] flex items-end p-6 md:p-10"
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="w-full max-w-md">
        <p className="font-display text-3xl italic text-fg">Abhishek Kumar</p>
        <div className="mt-5 h-px w-full bg-line">
          <div className="h-px origin-left bg-accent" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          <span className={pct >= 100 ? 'text-accent' : ''}>{pct >= 100 ? 'Liftoff' : checks[step]}</span>
          <span className="tabular-nums text-fg">T−{String(t).padStart(2, '0')}</span>
        </div>
      </div>
    </motion.div>
  )
}
