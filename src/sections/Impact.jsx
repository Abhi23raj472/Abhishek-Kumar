import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { BadgeCheck, CalendarCheck, Gauge, Network, Satellite, ShieldCheck, Wrench } from 'lucide-react'
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
    <div className="col-start-2 flex h-10 items-center gap-3 lg:col-start-auto">
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
        className={`w-[5.75rem] shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-500 ${
          arrived ? 'text-accent' : 'text-mute'
        }`}
      >
        {kind}
      </span>
    </div>
  )
}

function Packet({ it, i, total, progress, reduce }) {
  // Lit once the downlink beam reaches this row; delivered once the packet lands.
  const threshold = (i + 0.5) / total
  const [lit, setLit] = useState(prerendering)
  const [arrived, setArrived] = useState(prerendering)
  useMotionValueEvent(progress, 'change', (v) => {
    if (!lit && v >= threshold) setLit(true)
  })
  useEffect(() => {
    if (reduce) {
      setLit(true)
      setArrived(true)
    }
  }, [reduce])

  const spot = useRef(null)
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    spot.current?.style.setProperty('--mx', `${e.clientX - r.left}px`)
    spot.current?.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <li
      onPointerMove={move}
      className="group relative grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-line py-6 pl-7 last:border-0 md:pl-10 lg:grid-cols-[4rem_minmax(0,1fr)_20rem] lg:gap-x-8"
    >
      {/* Cursor spotlight */}
      <span
        ref={spot}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 9%, transparent), transparent 70%)' }}
      />

      {/* Node on the downlink beam */}
      <span aria-hidden className="absolute left-0 top-1/2 -ml-[5px] -mt-[5px] md:left-0">
        <span
          className={`block h-[10px] w-[10px] rounded-full border transition-all duration-500 ${
            lit ? 'scale-100 border-accent bg-accent shadow-[0_0_12px_var(--accent)]' : 'scale-75 border-line bg-bg'
          }`}
        />
      </span>

      <span className={`relative font-mono text-xs transition-colors duration-500 ${lit ? 'text-accent' : 'text-mute'}`}>
        <span className="sr-only">{it.code}</span>
        <Decode text={it.code} run={lit && !reduce && !prerendering} />
      </span>
      <div className="relative min-w-0">
        <h3 className="font-display text-xl transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">{it.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-mute">{it.body}</p>
      </div>

      <div className="relative col-start-2 lg:col-start-auto">
        <Delivery code={it.code} fire={lit} arrived={arrived} reduce={reduce} onArrive={() => setArrived(true)} />
      </div>
    </li>
  )
}

export default function Impact() {
  const list = useRef(null)
  const reduce = useReducedMotion()
  // The beam fills as the list scrolls through the middle of the screen.
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 55%'] })
  const beam = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })
  const fullBeam = reduce || prerendering

  return (
    <section id="impact" className="shell py-24 md:py-36">
      <SectionHead
        index="03"
        kicker="Impact"
        title="Signals from the missions."
        highlight={['missions.']}
        sub="Results the suites, frameworks and pipelines sent back."
      />
      <div className="panel relative overflow-hidden rounded-2xl px-5 md:px-8">
        <div className="hidden grid-cols-[4rem_minmax(0,1fr)_20rem] gap-x-8 border-b border-line py-4 pl-10 lg:grid">
          {['Packet', 'Result', 'Downlink'].map((h) => (
            <span key={h} className="label">{h}</span>
          ))}
        </div>

        <div className="relative">
          {/* Downlink beam: a dim rail with a bright fill that follows the scroll. */}
          <span aria-hidden className="absolute bottom-6 left-0 top-6 w-px bg-line" />
          <motion.span
            aria-hidden
            className="absolute bottom-6 left-0 top-6 w-px origin-top bg-accent shadow-[0_0_10px_var(--accent)]"
            style={fullBeam ? undefined : { scaleY: beam }}
          />
          <span aria-hidden className="absolute -left-[11px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-bg text-accent">
            <Satellite size={12} strokeWidth={1.6} />
          </span>

          <ul ref={list}>
            {impact.map((it, i) => (
              <Packet key={it.code} it={it} i={i} total={impact.length} progress={beam} reduce={reduce} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
