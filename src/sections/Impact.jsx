import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { BadgeCheck, CalendarCheck, Gauge, Network, ShieldCheck, Wrench } from 'lucide-react'
import { impact } from '../data'
import { SectionHead, ease } from '../lib/motion'

// What each result is about, shown as the receiver that lights up.
const receivers = {
  'I-01': { Icon: Gauge, kind: 'Speed' },
  'I-02': { Icon: ShieldCheck, kind: 'Coverage' },
  'I-03': { Icon: Wrench, kind: 'Effort' },
  'I-04': { Icon: Network, kind: 'Throughput' },
  'I-05': { Icon: BadgeCheck, kind: 'Quality' },
  'I-06': { Icon: CalendarCheck, kind: 'Delivery' },
}

const prerendering = typeof window === 'undefined'

/** A signal packet travels down a dashed track and lights up the result it carries. */
function Delivery({ code, run, delay, onArrive, arrived, reduce }) {
  const { Icon, kind } = receivers[code] ?? receivers['I-01']
  return (
    <div className="col-start-2 flex h-9 items-center gap-3 lg:col-start-auto">
      <div className="relative h-full flex-1">
        <span aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
        {!prerendering && !reduce && !arrived && (
          <motion.span
            aria-hidden
            className="absolute top-1/2 -mt-[3.5px] h-[7px] w-[7px] rounded-full bg-accent"
            style={{ x: '-50%', boxShadow: '0 0 10px var(--accent)' }}
            initial={{ left: '0%', opacity: 0 }}
            animate={run ? { left: ['0%', '100%'], opacity: [0, 1, 1] } : undefined}
            transition={{ duration: 1.3, ease: [0.45, 0, 0.25, 1], delay, times: [0, 0.15, 1] }}
            onAnimationComplete={() => run && onArrive()}
          />
        )}
      </div>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[color,border-color,box-shadow] duration-500 ${
          arrived ? 'border-accent text-accent shadow-[0_0_14px_-4px_var(--accent)]' : 'border-line text-mute'
        }`}
      >
        <Icon size={17} strokeWidth={1.6} aria-hidden />
      </span>
      <span
        className={`w-[5.5rem] shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-500 ${
          arrived ? 'text-accent' : 'text-mute'
        }`}
      >
        {kind}
      </span>
    </div>
  )
}

function Packet({ it, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  // Before JavaScript runs (and with reduced motion) show the delivered state.
  const [arrived, setArrived] = useState(prerendering)
  const done = arrived || (reduce && inView)
  const travel = 0.3 + i * 0.08

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.8, ease, delay: i * 0.08 }}
      className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-line py-5 last:border-0 lg:grid-cols-[4.5rem_minmax(0,1fr)_19rem] lg:gap-x-8"
    >
      <span className="font-mono text-xs text-accent">{it.code}</span>
      <div className="min-w-0">
        <h3 className="font-display text-xl md:text-2xl">{it.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-mute">{it.body}</p>
      </div>

      <Delivery code={it.code} run={inView} delay={travel} arrived={done} reduce={reduce} onArrive={() => setArrived(true)} />
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
        <div className="hidden grid-cols-[4.5rem_minmax(0,1fr)_19rem] gap-x-8 border-b border-line py-4 lg:grid">
          {['Packet', 'Result', 'Delivery'].map((h) => (
            <span key={h} className="label">{h}</span>
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
