import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { BadgeCheck, CalendarCheck, Gauge, Network, ShieldCheck, Wrench } from 'lucide-react'
import { impact } from '../data'
import { SectionHead, ease } from '../lib/motion'

// What each result is about, shown as the receiver that lights up.
const receivers = {
  'I-01': { Icon: Gauge, kind: 'Speed' },
  'I-02': { Icon: ShieldCheck, kind: 'Coverage' },
  'I-03': { Icon: Wrench, kind: 'Effort' },
  'I-04': { Icon: Network, kind: 'Scale' },
  'I-05': { Icon: BadgeCheck, kind: 'Quality' },
  'I-06': { Icon: CalendarCheck, kind: 'Delivery' },
}

// The headline figure for each result, where the result has one.
const metrics = {
  'I-01': { v: '40%', u: 'faster' },
  'I-02': { v: '120', u: 'API tests' },
  'I-03': { v: '50%', u: 'less upkeep' },
  'I-04': { v: '200+', u: 'runs a day' },
}

const prerendering = typeof window === 'undefined'
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#/'

/** Text that scrambles, then locks in left to right, like a signal resolving. */
function Decode({ text, run }) {
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (!run) return
    let frame = 0
    const id = setInterval(() => {
      frame++
      const locked = Math.floor(frame / 3)
      setOut([...text].map((ch, i) => (i < locked || ch === '-' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''))
      if (locked >= text.length) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [text, run])
  return <span aria-hidden>{out}</span>
}

/** Track from the beam to the receiver: a packet flies across, then the receiver pings. */
function Delivery({ code, fire, arrived, onArrive, reduce }) {
  const { Icon, kind } = receivers[code] ?? receivers['I-01']
  return (
    <div className="flex h-10 items-center gap-3">
      <div className="relative h-full flex-1 overflow-hidden">
        <span aria-hidden className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
        {/* The part of the track the packet has already travelled glows. */}
        <motion.span
          aria-hidden
          className="absolute left-0 top-1/2 h-px w-full origin-left bg-accent/60"
          initial={false}
          animate={{ scaleX: arrived ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.45, 0, 0.25, 1] }}
          style={prerendering ? { transform: 'scaleX(1)' } : undefined}
        />
        {!prerendering && !reduce && fire && !arrived && (
          <motion.span
            aria-hidden
            className="absolute top-1/2 -mt-1 h-2 w-6 rounded-full bg-accent"
            style={{ x: '-100%', boxShadow: '0 0 12px 1px var(--accent)', filter: 'blur(0.3px)' }}
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 0.9, ease: [0.45, 0, 0.25, 1] }}
            onAnimationComplete={onArrive}
          />
        )}
      </div>

      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <AnimatePresence>
          {arrived && !reduce && !prerendering &&
            [0, 1].map((r) => (
              <motion.span
                key={r}
                aria-hidden
                className="absolute inset-0 rounded-full border border-accent"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: r * 0.35 }}
              />
            ))}
        </AnimatePresence>
        <motion.span
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-[color,border-color,background-color,box-shadow] duration-500 ${
            arrived ? 'border-accent bg-accent/10 text-accent shadow-[0_0_18px_-4px_var(--accent)]' : 'border-line text-mute'
          }`}
          initial={false}
          animate={arrived && !reduce ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          <Icon size={18} strokeWidth={1.6} aria-hidden />
        </motion.span>
      </span>
      <span
        className={`hidden w-[5.75rem] shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-500 sm:inline ${
          arrived ? 'text-accent' : 'text-mute'
        }`}
      >
        {kind}
      </span>
    </div>
  )
}

/** One result as a card: a packet flies to its receiver when the card scrolls in, then the figure lands. */
function Packet({ it, i, reduce }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  const [lit, setLit] = useState(prerendering)
  const [arrived, setArrived] = useState(prerendering)
  useEffect(() => {
    if (reduce) {
      setLit(true)
      setArrived(true)
      return
    }
    if (!inView) return
    const t = setTimeout(() => setLit(true), (i % 3) * 180)
    return () => clearTimeout(t)
  }, [inView, reduce, i])
  const m = metrics[it.code]

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
      className={`panel group relative flex flex-col rounded-2xl p-4 transition-colors duration-500 sm:p-6 ${arrived ? 'border-accent/30' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className={`font-mono text-xs transition-colors duration-500 ${lit ? 'text-accent' : 'text-mute'}`}>
          <span className="sr-only">{it.code}</span>
          <Decode text={it.code} run={lit && !reduce && !prerendering} />
        </span>
        <div className="min-w-0 flex-1">
          <Delivery code={it.code} fire={lit} arrived={arrived} reduce={reduce} onArrive={() => setArrived(true)} />
        </div>
      </div>

      {m && (
        <p className="mt-5 flex items-baseline gap-2 sm:mt-7">
          <motion.span
            className="text-gradient font-display text-[2.6rem] leading-none sm:text-6xl"
            initial={false}
            animate={arrived ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 6 }}
            transition={{ duration: 0.6, ease }}
          >
            {m.v}
          </motion.span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{m.u}</span>
        </p>
      )}
      <h3 className={`font-display text-lg leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl ${m ? 'mt-3' : 'mt-5 sm:mt-7'}`}>{it.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-mute sm:text-sm">{it.body}</p>
    </motion.li>
  )
}

export default function Impact() {
  const reduce = useReducedMotion()
  return (
    <section id="impact" className="shell py-16 md:py-24">
      <SectionHead
        index="03"
        kicker="Impact"
        title="Signals from the missions."
        highlight={['missions.']}
        sub="Results the suites, frameworks and pipelines sent back."
      />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {impact.map((it, i) => (
          <Packet key={it.code} it={it} i={i} reduce={reduce} />
        ))}
      </ul>
    </section>
  )
}
