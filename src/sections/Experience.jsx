import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { education, experience } from '../data'
import { SectionHead, ease } from '../lib/motion'

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
const toDate = (s) => {
  const [m, y] = s.split(' ')
  return new Date(+y, MONTHS[m])
}

/** Months between the two ends of a period like "Sep 2021 — Nov 2025" (or "— Present"). */
function months(period) {
  const [a, b] = period.split(' — ')
  const start = toDate(a)
  const end = b === 'Present' ? new Date() : toDate(b)
  return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth())
}
const duration = (mo) => {
  const y = Math.floor(mo / 12)
  const m = mo % 12
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ')
}

// Newest first; mission numbers count up from the first job.
const missions = experience.map((e, i) => ({
  ...e,
  no: String(experience.length - i).padStart(2, '0'),
  months: months(e.period),
}))
const careerStart = toDate(missions[missions.length - 1].period.split(' — ')[0])

const SHOWN = 4 // log lines visible before "full log"

/** Sticky readout beside the route: it follows whichever mission is on screen. */
function FlightComputer({ active }) {
  const m = missions[active] ?? missions[0]
  const total = missions.reduce((n, x) => n + x.months, 0)
  const rows = [
    ['Craft', <>{m.org}<span className="block text-mute">{m.place}</span></>],
    ['Position', m.role],
    ['Elapsed', `T+ ${duration(m.months)}`],
  ]
  return (
    <div className="panel rounded-2xl p-5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between">
        <span className="label">Flight computer</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          <motion.span className="h-1.5 w-1.5 rounded-full bg-accent" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          Live
        </span>
      </div>

      <motion.p key={m.no} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }} className="mt-4 font-display text-4xl">
        Mission {m.no}
      </motion.p>
      <p className={`mt-1 font-mono text-[11px] uppercase tracking-[0.16em] ${m.current ? 'text-accent' : 'text-mute'}`}>
        {m.current ? '● In orbit' : '✓ Mission complete'}
      </p>

      <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-[13px]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-2">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">{k}</dt>
            <motion.dd key={`${m.no}-${k}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {v}
            </motion.dd>
          </div>
        ))}
      </dl>

      {/* the whole career on one bar, oldest on the left; the mission on screen lights up */}
      <div className="mt-6 border-t border-line pt-4">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
          <span>{careerStart.getFullYear()}</span>
          <span>{duration(total)} in QA</span>
          <span>Now</span>
        </div>
        <div className="mt-2 flex h-2 gap-[3px]">
          {[...missions].reverse().map((x) => (
            <span
              key={x.no}
              className={`rounded-full transition-colors duration-300 ${x.no === m.no ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-line'}`}
              style={{ flex: x.months }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LogLine({ children }) {
  return (
    <li className="flex gap-3 text-[15px] leading-relaxed text-fg/85">
      <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
      {children}
    </li>
  )
}

function Mission({ m, i, onActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (inView) onActive(i)
  }, [inView, i, onActive])
  const extra = m.points.length - SHOWN

  return (
    <li ref={ref} className="relative pl-12 md:pl-16">
      {/* node on the route */}
      <span aria-hidden className="absolute left-[9px] top-7 grid h-[15px] w-[15px] place-items-center md:left-[17px]">
        <span className={`absolute inset-0 rounded-full transition-all duration-500 ${inView ? 'scale-[2.2] bg-accent/25 blur-[2px]' : 'scale-100 bg-transparent'}`} />
        <span className={`relative h-[9px] w-[9px] rounded-full border-2 transition-colors duration-500 ${inView ? 'border-accent bg-[var(--star)]' : 'border-mute bg-bg'}`} />
      </span>

      <motion.article
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease }}
        className={`panel rounded-2xl p-6 transition-colors duration-500 md:p-8 ${inView ? 'border-accent/40' : ''}`}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
          <span className="text-accent">Mission {m.no}</span>
          <span aria-hidden>·</span>
          <span>{m.period}</span>
          <span aria-hidden>·</span>
          <span>{duration(m.months)}</span>
          {m.current && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-accent sm:ml-auto">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" /> In orbit
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,2.6rem)] leading-[1.05]">{m.role}</h3>
        <p className="mt-1.5 text-[15px] text-mute">
          <span className="text-fg">{m.org}</span> · {m.place}
        </p>

        <p className="label mt-6">Mission log</p>
        <ul className="mt-3 space-y-2.5">
          {m.points.slice(0, SHOWN).map((pt) => (
            <LogLine key={pt}>{pt}</LogLine>
          ))}
        </ul>
        {/* the rest of the log stays in the page (for search engines) and folds open */}
        {extra > 0 && (
          <>
            <motion.div
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.45, ease }}
              className="overflow-hidden"
              aria-hidden={!open}
            >
              <ul className="space-y-2.5 pt-2.5">
                {m.points.slice(SHOWN).map((pt) => (
                  <LogLine key={pt}>{pt}</LogLine>
                ))}
              </ul>
            </motion.div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-[13px] transition-colors hover:border-accent"
            >
              {open ? 'Show less' : `Full mission log (${m.points.length})`}
              <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-5">
          {m.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-mute">
              {t}
            </span>
          ))}
        </div>
      </motion.article>
    </li>
  )
}

export default function Experience() {
  const [active, setActive] = useState(0)
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 55%', 'end 55%'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  const top = useTransform(p, (v) => `${v * 100}%`)

  return (
    <section id="experience" className="shell py-24 md:py-36">
      <SectionHead
        index="04"
        kicker="Experience"
        title="Five years on one flight path."
        highlight={['flight', 'path.']}
        sub="Newest mission first. The flight computer follows the mission on screen."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        <div className="hidden lg:block lg:self-stretch">
          <FlightComputer active={active} />
        </div>

        <div ref={track} className="relative">
          {/* the route, lit up to where you've scrolled, with the craft riding it */}
          <div aria-hidden className="absolute bottom-6 left-4 top-6 w-px bg-line md:left-6">
            <motion.div className="absolute inset-x-0 top-0 bg-accent" style={{ height: top }} />
            <motion.span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top }}>
              <span className="block h-3 w-3 rotate-45 border border-accent bg-bg shadow-[0_0_14px_var(--accent)]" />
            </motion.span>
          </div>

          <ol className="space-y-8">
            {missions.map((m, i) => (
              <Mission key={m.org} m={m} i={i} onActive={setActive} />
            ))}

            {/* where it started */}
            <li className="relative pl-12 md:pl-16">
              <span aria-hidden className="absolute left-[9px] top-5 grid h-[15px] w-[15px] place-items-center md:left-[17px]">
                <span className="h-[9px] w-[9px] rounded-full border-2 border-mute bg-bg" />
              </span>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease }}
                className="flex items-start gap-4 rounded-2xl border border-dashed border-line p-5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-accent">
                  <GraduationCap size={18} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                    <span className="text-accent">Launch pad</span> · {education.year}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl leading-tight">{education.degree}</h3>
                  <p className="mt-1 text-sm text-mute">{education.school}</p>
                </div>
              </motion.div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
