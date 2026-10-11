import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import { experience } from '../data'
import { SectionHead, ease } from '../lib/motion'

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
const toDate = (s) => {
  const [m, y] = s.split(' ')
  return new Date(+y, MONTHS[m])
}
/** Months between the two ends of a period like "Sep 2021 — Nov 2025" (or "— Present"). */
function months(period) {
  const [a, b] = period.split(' — ')
  const end = b === 'Present' ? new Date() : toDate(b)
  const start = toDate(a)
  return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth())
}
const duration = (mo) => {
  const y = Math.floor(mo / 12)
  const m = mo % 12
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ')
}

// The flight, in time order: liftoff in 2021, then each job as a stage, ending in orbit.
const jobs = [...experience].reverse()
const stages = [
  { id: 'liftoff', name: 'Liftoff', tag: 'T−0', at: 0 },
  ...jobs.map((j, i) => ({
    id: j.org,
    name: j.current ? 'Orbit' : `Stage ${i + 1}`,
    tag: j.current ? 'In orbit' : 'Ascent',
    at: (i + 1) / jobs.length,
    job: { ...j, months: months(j.period) },
  })),
]
const totalYears = jobs.reduce((n, j) => n + months(j.period), 0) / 12
const SEPARATE_AT = 0.62 // scroll progress where the booster drops away
const ROCKET_H = 140

/** The rocket: upper stage and booster. The booster falls away after stage separation. */
function Rocket({ separated, reduce }) {
  return (
    <svg viewBox="0 0 40 120" className="h-[140px] w-[47px] overflow-visible" aria-hidden>
      {/* exhaust */}
      <motion.g
        style={{ originX: '20px', originY: separated ? '74px' : '104px' }}
        animate={reduce ? undefined : { scaleY: [1, 1.35, 0.9, 1.2, 1], opacity: [0.9, 1, 0.8, 1, 0.9] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <path d={separated ? 'M14 74 Q20 104 26 74 Z' : 'M13 104 Q20 140 27 104 Z'} fill="var(--accent)" opacity="0.9" />
        <path d={separated ? 'M17 74 Q20 92 23 74 Z' : 'M16 104 Q20 126 24 104 Z'} fill="var(--star)" />
      </motion.g>
      {/* booster */}
      <motion.g
        animate={separated ? { y: 70, rotate: 22, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
        transition={{ duration: separated ? 1.4 : 0.5, ease }}
        style={{ originX: '20px', originY: '90px' }}
      >
        <rect x="12" y="74" width="16" height="30" rx="2" fill="var(--panel)" stroke="var(--fg)" strokeWidth="1.4" />
        <path d="M12 92 L5 106 L12 104 Z M28 92 L35 106 L28 104 Z" fill="var(--signal)" />
        <line x1="12" y1="82" x2="28" y2="82" stroke="var(--line)" />
      </motion.g>
      {/* upper stage */}
      <path d="M20 4 C29 16 30 34 30 46 L30 72 L10 72 L10 46 C10 34 11 16 20 4 Z" fill="var(--panel)" stroke="var(--fg)" strokeWidth="1.4" />
      <circle cx="20" cy="34" r="5" fill="var(--bg)" stroke="var(--signal)" strokeWidth="1.6" />
      <path d="M10 60 L4 72 L10 72 Z M30 60 L36 72 L30 72 Z" fill="var(--signal)" />
      <line x1="10" y1="72" x2="30" y2="72" stroke="var(--fg)" strokeWidth="1.4" />
    </svg>
  )
}

/** Sticky altitude gauge with the rocket climbing it as you read down the stages. */
function Gauge({ progress, active, separated }) {
  const reduce = useReducedMotion()
  // Height of the climb, measured so the rocket and its trail can be placed in pixels.
  const column = useRef(null)
  const room = useMotionValue(400)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => room.set(e.contentRect.height))
    ro.observe(column.current)
    return () => ro.disconnect()
  }, [room])
  const rise = useTransform([progress, room], ([v, h]) => v * (h - ROCKET_H))
  // the trail starts at the engine: higher up the body once the booster has gone
  const trailFull = useTransform(rise, (r) => r + 18)
  const trailUpper = useTransform(rise, (r) => r + 56)
  const alt = useTransform(progress, (v) => `T+ ${(v * totalYears).toFixed(1)} yrs`)
  // Speed lines brighten while the page is moving.
  const vel = useVelocity(progress)
  const streak = useTransform(vel, [-1, 0, 1], [0.7, 0, 0.7])

  return (
    <div className="panel sticky top-24 flex h-[calc(100svh-8rem)] max-h-[680px] min-h-[460px] flex-col rounded-2xl p-5">
      <div className="flex items-baseline justify-between">
        <span className="label">Altitude</span>
        <motion.span className="font-mono text-[12px] tabular-nums text-accent">{alt}</motion.span>
      </div>

      <div ref={column} className="relative mt-4 flex-1">
        {/* scale: stage markers from the pad (bottom) to orbit (top) */}
        <div aria-hidden className="absolute inset-y-0 left-[64px] w-px bg-line" />
        {Array.from({ length: 21 }, (_, t) => (
          <span key={t} aria-hidden className={`absolute left-[64px] h-px bg-line ${t % 5 === 0 ? 'w-3' : 'w-1.5'}`} style={{ bottom: `${t * 5}%` }} />
        ))}
        {stages.map((s, i) => (
          <div
            key={s.id}
            className={`absolute left-0 w-[56px] -translate-y-1/2 whitespace-nowrap text-right font-mono text-[10px] uppercase leading-tight tracking-[0.1em] transition-colors duration-300 ${
              i <= active ? 'text-accent' : 'text-mute'
            }`}
            style={{ bottom: `calc(${s.at * 100}% - ${s.at * 16}px + 8px)` }}
          >
            {s.name}
          </div>
        ))}

        {/* speed lines */}
        {!reduce &&
          [18, 42, 66, 82].map((x, i) => (
            <motion.span
              key={x}
              aria-hidden
              className="absolute top-0 h-10 w-px bg-gradient-to-b from-transparent to-[var(--star)]"
              style={{ left: `${x}%`, opacity: streak }}
              animate={{ y: ['-20%', '1200%'] }}
              transition={{ duration: 1.2 + i * 0.2, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
            />
          ))}
        <motion.div className="absolute left-[calc(64px+20px)]" style={{ bottom: rise }}>
          {/* exhaust trail from the engine down to the pad */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[var(--accent)] to-transparent"
            style={{ top: separated ? 'calc(100% - 56px)' : 'calc(100% - 18px)', height: separated ? trailUpper : trailFull }}
          />
          <Rocket separated={separated} reduce={reduce} />
        </motion.div>
        {/* the pad */}
        <div aria-hidden className="absolute -bottom-1 left-[calc(64px+8px)] h-1 w-[80px] rounded-full bg-line" />
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <p className="label">Now passing</p>
        <motion.p key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="mt-1 font-display text-2xl">
          {stages[active].name}
        </motion.p>
      </div>
    </div>
  )
}

/** Phones: the same climb as a slim bar that sticks under the header. */
function MiniGauge({ progress, active }) {
  const left = useTransform(progress, (v) => `calc(${v * 100}% - ${v * 18}px)`)
  return (
    <div className="sticky top-[4.5rem] z-20 mb-6 rounded-xl border border-line bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] px-4 py-3 shadow-lg backdrop-blur-md lg:hidden">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
        <span className="text-mute">Altitude</span>
        <span className="text-accent">{stages[active].name}</span>
      </div>
      <div className="relative mt-2.5 h-[18px]">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <motion.div className="absolute left-0 top-1/2 h-px bg-[var(--accent)]" style={{ width: left }} />
        {stages.map((s, i) => (
          <span
            key={s.id}
            className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i <= active ? 'bg-accent' : 'bg-line'}`}
            style={{ left: `calc(${s.at * 100}% - ${s.at * 18}px + 9px)` }}
          />
        ))}
        <motion.span className="absolute top-0 grid h-[18px] w-[18px] rotate-90 place-items-center text-fg" style={{ left }} aria-hidden>
          <svg viewBox="0 0 20 20" className="h-4 w-4">
            <path d="M10 2c3 3 3.5 7 3.5 9.5V15h-7v-3.5C6.5 9 7 5 10 2Z" fill="currentColor" />
            <path d="M6.5 12 4 16h2.5Zm7 0 2.5 4h-2.5Z" fill="var(--accent)" />
          </svg>
        </motion.span>
      </div>
    </div>
  )
}

function Win({ w }) {
  return (
    <li className="flex gap-3 rounded-xl border border-line bg-fg/[0.03] p-3.5">
      <Star size={15} className="mt-0.5 shrink-0 text-signal" aria-hidden />
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-fg">{w.k}</span>
        <span className="block text-[13px] leading-snug text-mute">{w.v}</span>
      </span>
    </li>
  )
}

function StageCard({ s, i, onActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (inView) onActive(i)
  }, [inView, i, onActive])
  const j = s.job

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease }}
      className={`panel rounded-2xl p-6 transition-colors duration-500 md:p-8 ${inView ? 'border-accent/40' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em]">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${j.current ? 'border-accent/40 bg-accent/10 text-accent' : 'border-line text-fg'}`}>
          {j.current && <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />}
          {s.name} · {s.tag}
        </span>
        <span className="text-mute">{j.period}</span>
        <span className="text-mute" aria-hidden>·</span>
        <span className="text-mute">{duration(j.months)}</span>
      </div>

      <h3 className="mt-5 font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.02]">{j.role}</h3>
      <p className="mt-1.5 text-[15px] text-mute">
        <span className="text-fg">{j.org}</span> · {j.place}
      </p>

      <p className="label mt-7">Key wins</p>
      <ul className="mt-3 grid gap-2.5 md:grid-cols-3">
        {j.wins.map((w) => (
          <Win key={w.k} w={w} />
        ))}
      </ul>

      {/* the full log stays in the page (for search engines) and folds open */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        <ul className="space-y-2.5 pt-6">
          {j.points.map((pt) => (
            <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-fg/85">
              <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
              {pt}
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <div className="flex flex-wrap gap-1.5">
          {j.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-mute">
              {t}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-[13px] transition-colors hover:border-accent"
        >
          {open ? 'Hide flight log' : `Full flight log (${j.points.length})`}
          <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </motion.li>
  )
}

export default function Experience() {
  const [active, setActive] = useState(stages.length - 1)
  const [separated, setSeparated] = useState(false)
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 45%', 'end 85%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  useMotionValueEvent(progress, 'change', (v) => setSeparated(v > SEPARATE_AT))

  return (
    <section id="experience" className="shell py-24 md:py-36">
      <SectionHead
        index="04"
        kicker="Experience"
        title="From liftoff to orbit."
        highlight={['orbit.']}
        sub="Five years in two stages. Scroll to fly the route; the booster drops away when the mission reaches orbit."
      />

      <div className="grid items-start gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        <div className="hidden self-stretch lg:block">
          <Gauge progress={progress} active={active} separated={separated} />
        </div>

        <div className="min-w-0">
          <MiniGauge progress={progress} active={active} />
          <ol ref={track} className="space-y-6">
            {stages.slice(1).map((s, i) => (
              <StageCard key={s.id} s={s} i={i + 1} onActive={setActive} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
