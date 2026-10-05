import { useMemo, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { impact } from '../data'
import { SectionHead, ease } from '../lib/motion'

// Deterministic jitter so each packet keeps the same trace between renders.
function trace(seed, points = 48) {
  let s = seed * 9301 + 49297
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  let y = 12
  const d = []
  for (let i = 0; i < points; i++) {
    y = Math.max(3, Math.min(21, y + (rnd() - 0.5) * 9))
    d.push(`${i === 0 ? 'M' : 'L'}${((i / (points - 1)) * 200).toFixed(1)} ${y.toFixed(1)}`)
  }
  return d.join(' ')
}

function Packet({ it, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const path = useMemo(() => trace(i + 3), [i])
  const strength = 3 + ((i * 7) % 3)
  const arrive = reduce ? 0 : 0.6 + i * 0.12

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.8, ease, delay: i * 0.08 }}
      className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 lg:grid-cols-[4.5rem_minmax(0,1fr)_12rem_4rem_6.5rem] lg:gap-x-6"
    >
      <span className="font-mono text-xs text-accent">{it.code}</span>
      <div className="min-w-0">
        <h3 className="font-display text-xl md:text-2xl">{it.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-mute">{it.body}</p>
      </div>

      {/* The trace "draws in" by unclipping left to right. Animating pathLength
          here would break the line into dashes: browsers measure dashes in
          screen pixels when vector-effect is non-scaling-stroke. */}
      <motion.svg
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        aria-hidden
        className="col-start-2 h-6 w-full lg:col-start-auto"
        initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.3 }}
        animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 0.9 } : undefined}
        transition={{ duration: 1.4, ease, delay: i * 0.08 + 0.2 }}
      >
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </motion.svg>

      <div aria-label={`Signal ${strength} of 5`} className="col-start-2 flex h-5 items-end gap-[3px] lg:col-start-auto">
        {[1, 2, 3, 4, 5].map((b) => (
          <motion.span
            key={b}
            className={`w-1 rounded-sm ${b <= strength ? 'bg-accent' : 'bg-line'}`}
            style={{ height: `${b * 20}%` }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : undefined}
            transition={{ duration: 0.3, delay: arrive + b * 0.05 }}
          />
        ))}
      </div>

      <motion.span
        className="col-start-2 font-mono text-[11px] uppercase tracking-[0.16em] lg:col-start-auto lg:text-right"
        initial={{ color: 'var(--mute)' }}
        animate={inView ? { color: 'var(--accent)' } : undefined}
        transition={{ delay: arrive + 0.4 }}
      >
        {inView ? '✓ Received' : 'Waiting'}
      </motion.span>
    </motion.li>
  )
}

export default function Impact() {
  return (
    <section id="impact" className="shell py-24 md:py-36">
      <SectionHead
        index="03"
        kicker="Impact"
        title="Signals from the missions."
        highlight={['missions.']}
        sub="Results the suites, frameworks and pipelines sent back."
      />
      <div className="panel rounded-2xl px-5 md:px-8">
        <div className="hidden grid-cols-[4.5rem_minmax(0,1fr)_12rem_4rem_6.5rem] gap-x-6 border-b border-line py-4 lg:grid">
          {['Packet', 'Result', 'Trace', 'Signal', 'Status'].map((h, i) => (
            <span key={h} className={`label ${i === 4 ? 'text-right' : ''}`}>{h}</span>
          ))}
        </div>
        <ul>
          {impact.map((it, i) => (
            <Packet key={it.code} it={it} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
