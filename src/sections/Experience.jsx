import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { education, experience } from '../data'
import { SectionHead, ease } from '../lib/motion'

// Oldest to newest, so the constellation reads left to right through time.
const entries = [
  {
    id: 'edu',
    star: 'Galgotias',
    year: '2021',
    role: education.degree,
    org: education.school,
    period: education.year,
    points: ['Graduated in Computer Science & Engineering and moved straight into quality engineering.'],
    tags: ['Computer Science', 'Engineering'],
  },
  ...[...experience].reverse().map((e) => ({
    id: e.org,
    star: e.org.split(' ')[0],
    year: e.period.split(' — ')[0].split(' ')[1],
    role: e.role,
    org: `${e.org} · ${e.place}`,
    period: e.period,
    points: e.points,
    tags: e.tags,
    current: e.current,
  })),
]

// Positions in a 100 x 56 box. Major stars are the entries; minor stars fill out the figure.
const major = [
  [14, 38],
  [47, 20],
  [82, 33],
]
const minor = [
  [5, 22], [24, 50], [62, 9], [57, 44], [93, 49], [88, 14], [36, 6], [72, 52],
  [10, 8], [30, 30], [68, 28], [96, 6], [42, 48], [3, 50],
]
const lines = [
  [major[0], major[1]],
  [major[1], major[2]],
  [major[0], minor[0]],
  [major[0], minor[1]],
  [major[1], minor[2]],
  [major[1], minor[3]],
  [major[2], minor[4]],
  [major[2], minor[5]],
]

export default function Experience() {
  const [sel, setSel] = useState(entries.length - 1)
  const go = (d) => setSel((v) => (v + d + entries.length) % entries.length)
  const e = entries[sel]

  return (
    <section id="experience" className="shell py-24 md:py-36">
      <SectionHead
        index="04"
        kicker="Experience"
        title="A career, charted in stars."
        highlight={['stars.']}
        sub="Each star is a stop on the route. Select one to open its mission log."
      />

      <div
        tabIndex={0}
        role="group"
        aria-label="Career constellation. Use the left and right arrow keys to move between stops."
        onKeyDown={(ev) => {
          if (ev.key === 'ArrowRight') go(1)
          if (ev.key === 'ArrowLeft') go(-1)
        }}
        className="relative rounded-2xl border border-line bg-[radial-gradient(ellipse_at_center,rgb(77_141_255/0.06),transparent_70%)] focus-visible:outline-accent"
      >
        <svg viewBox="0 0 100 56" className="block h-auto w-full" aria-hidden>
          {minor.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={0.35 + (i % 3) * 0.15}
              fill="#cfdcf3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 0.9, 0.5] }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.2 + i * 0.05 }}
            />
          ))}
          {lines.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke="var(--accent)"
              strokeWidth="0.15"
              strokeOpacity={i < 2 ? 0.7 : 0.3}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, ease, delay: 0.4 + i * 0.12 }}
            />
          ))}
        </svg>

        {entries.map((en, i) => {
          const [x, y] = major[i]
          const active = i === sel
          return (
            <button
              key={en.id}
              type="button"
              onClick={() => setSel(i)}
              aria-pressed={active}
              aria-label={`${en.role}, ${en.period}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-3"
              style={{ left: `${x}%`, top: `${(y / 56) * 100}%` }}
            >
              <span className="relative grid place-items-center">
                <motion.span
                  className="absolute h-8 w-8 rounded-full bg-accent/25 blur-md"
                  animate={{ scale: active ? [1, 1.5, 1] : 1, opacity: active ? 1 : 0.4 }}
                  transition={{ duration: 2.4, repeat: active ? Infinity : 0 }}
                />
                <span className={`relative h-2.5 w-2.5 rounded-full ${active ? 'bg-white' : 'bg-accent'} shadow-[0_0_12px_var(--accent)]`} />
              </span>
              <span
                className={`absolute top-full whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  i === 0 ? 'left-1' : i === entries.length - 1 ? 'right-1' : 'left-1/2 -translate-x-1/2'
                } ${active ? 'text-fg' : 'text-mute'}`}
              >
                {en.star} · {en.year}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button type="button" onClick={() => go(-1)} aria-label="Previous stop" className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent">
          <ArrowLeft size={15} />
        </button>
        <div className="flex gap-2">
          {entries.map((en, i) => (
            <button
              key={en.id}
              type="button"
              onClick={() => setSel(i)}
              aria-label={`Show ${en.role}`}
              className={`h-1.5 rounded-full transition-all ${i === sel ? 'w-6 bg-accent' : 'w-1.5 bg-line'}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next stop" className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent">
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="panel mt-6 overflow-hidden rounded-2xl" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
            className="p-6 md:p-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-3xl">{e.role}</h3>
              <span className="label">
                {e.period}
                {e.current && <span className="ml-2 text-signal">● Current</span>}
              </span>
            </div>
            <p className="mt-1 text-sm text-mute">{e.org}</p>
            <ul className="mt-5 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
              {e.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-fg/85">
                  <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-mute">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}
