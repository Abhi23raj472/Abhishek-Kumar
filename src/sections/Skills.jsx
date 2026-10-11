import { useRef, useState } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { latest, proficiency, skillCats, skillCloud } from '../data'
import { Reveal, Section, Stagger, StaggerItem, isServer } from '../lib/motion'

const RANKS = { expert: 3, advanced: 2, proficient: 1 }
const C = 200 // radar centre in the 400 x 400 viewBox
const R = 140 // outer ring radius

/** Level as three ticks on a gauge: filled ones mark the level. */
function Rank({ level }) {
  const n = RANKS[level] ?? 1
  return (
    <span className="flex items-center gap-2.5" aria-hidden>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">{level}</span>
      <span className="flex gap-[3px]">
        {[1, 2, 3].map((k) => (
          <span key={k} className={`h-3 w-[7px] ${k <= n ? 'bg-ink' : 'bg-rule'}`} />
        ))}
      </span>
    </span>
  )
}

// Axis k points up first and runs clockwise.
const axisDeg = (k, n) => (360 / n) * k
const point = (deg, r) => {
  const a = (deg * Math.PI) / 180
  return [C + r * Math.sin(a), C - r * Math.cos(a)]
}
const ring = (n, r) => Array.from({ length: n }, (_, k) => point(axisDeg(k, n), r).join(',')).join(' ')

/** One skill's vertex: it marks itself as the sweep line passes over it. */
function Vertex({ x, y, deg, sweep, active, delay, on, onHover }) {
  const flare = useTransform(sweep, (s) => {
    const behind = (((s - deg) % 360) + 360) % 360
    return behind < 40 ? 1 - behind / 40 : 0
  })
  const ringR = useTransform(flare, (f) => 7 + f * 9)
  const ringO = useTransform(flare, (f) => f * 0.9)
  return (
    <motion.g
      initial={isServer ? false : { opacity: 0, scale: 0 }}
      animate={on ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 16, delay }}
      onPointerEnter={onHover}
      className="cursor-pointer"
    >
      <circle cx={x} cy={y} r="18" fill="transparent" />
      <motion.circle cx={x} cy={y} r={ringR} fill="none" stroke="var(--stamp)" strokeWidth="1.5" style={{ opacity: ringO }} />
      <rect x={x - (active ? 6 : 4.5)} y={y - (active ? 6 : 4.5)} width={active ? 12 : 9} height={active ? 12 : 9} fill={active ? 'var(--stamp)' : 'var(--sheet)'} stroke="var(--stamp)" strokeWidth="2" />
    </motion.g>
  )
}

/** Every skill on its own axis, joined into one shape, with a sweep line passing round like a gauge reading. */
function Radar({ items, active, setActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const on = isServer || reduce || inView
  const n = items.length
  const sweep = useMotionValue(0)
  useAnimationFrame((_, delta) => {
    if (!reduce && inView) sweep.set((sweep.get() + delta * 0.05) % 360)
  })

  const verts = items.map((p, k) => point(axisDeg(k, n), (R * p.pct) / 100))
  const shape = verts.map((v) => v.join(',')).join(' ')
  const lead = point(0, R)
  const current = active == null ? null : items[active]

  return (
    <svg ref={ref} viewBox="0 0 400 400" className="mx-auto block w-full max-w-[440px] overflow-visible" aria-hidden onPointerLeave={() => setActive(null)}>
      {/* graticule: rings at 25% steps, tick marks on the outer ring, axes */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(n, R * f)} fill="none" stroke={f === 1 ? 'var(--ink)' : 'var(--rule)'} strokeWidth={f === 1 ? 1.4 : 1} />
      ))}
      {Array.from({ length: 60 }, (_, t) => {
        const [x1, y1] = point(t * 6, R + 14)
        const [x2, y2] = point(t * 6, R + (t % 5 === 0 ? 22 : 18))
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--rule)" strokeWidth="1" />
      })}
      {items.map((p, k) => {
        const [x, y] = point(axisDeg(k, n), R)
        return (
          <line
            key={p.name}
            x1={C} y1={C} x2={x} y2={y}
            stroke={active === k ? 'var(--stamp)' : 'var(--rule)'}
            strokeWidth={active === k ? 1.6 : 1}
            style={{ transition: 'stroke 0.2s' }}
          />
        )
      })}

      {/* sweep line; the invisible full circle keeps its pivot on the centre */}
      {!reduce && (
        <motion.g style={{ rotate: sweep }}>
          <circle cx={C} cy={C} r={R + 22} fill="none" />
          <line x1={C} y1={C} x2={lead[0]} y2={lead[1] - 22} stroke="var(--stamp)" strokeWidth="1.2" strokeDasharray="3 3" />
        </motion.g>
      )}

      {/* the skills shape grows out from the centre (same invisible-circle pivot) */}
      <motion.g
        initial={isServer || reduce ? false : { scale: 0, opacity: 0 }}
        animate={on ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 80, damping: 13, delay: 0.15 }}
      >
        <circle cx={C} cy={C} r={R} fill="none" />
        <polygon points={shape} fill="var(--stamp-wash)" stroke="var(--stamp)" strokeWidth="2.2" strokeLinejoin="miter" />
      </motion.g>

      {verts.map(([x, y], k) => (
        <Vertex
          key={items[k].name}
          x={x} y={y}
          deg={axisDeg(k, n)}
          sweep={sweep}
          active={active === k}
          on={on}
          delay={reduce ? 0 : 0.6 + k * 0.08}
          onHover={() => setActive(k)}
        />
      ))}

      {/* axis labels */}
      {items.map((p, k) => {
        const deg = axisDeg(k, n)
        const [x, y] = point(deg, R + 38)
        const s = Math.sin((deg * Math.PI) / 180)
        const anchor = Math.abs(s) < 0.2 ? 'middle' : s > 0 ? 'start' : 'end'
        return (
          <text
            key={p.name}
            x={x}
            y={y + 4}
            textAnchor={anchor}
            className={`font-mono text-[12px] font-medium uppercase ${active === k ? 'fill-stamp' : 'fill-ink'}`}
            letterSpacing="1"
            onPointerEnter={() => setActive(k)}
          >
            {p.short}
          </text>
        )
      })}

      {/* centre readout */}
      <rect x={C - 46} y={C - 22} width="92" height="44" fill="var(--sheet)" stroke="var(--ink)" />
      <text x={C} y={C - 2} textAnchor="middle" className="fill-ink text-[13px] font-bold">
        {current ? current.short : 'Skills'}
      </text>
      <text x={C} y={C + 13} textAnchor="middle" className="fill-stamp font-mono text-[9px] uppercase" letterSpacing="1.2">
        {current ? current.level : `${n} tracked`}
      </text>
    </svg>
  )
}

export default function Skills() {
  const [active, setActive] = useState(null)
  return (
    <Section
      id="skills"
      no="5.0"
      label="Skills"
      title="Toolkit and depth."
      intro="What I work with, how deep each core skill goes, and what I've added most recently."
    >
      {/* most recent additions first */}
      <div className="border border-stamp">
        <p className="flex items-center gap-2 border-b border-stamp bg-stamp px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-on-ink">
          Latest additions · 2026
        </p>
        <Stagger className="grid sm:grid-cols-3">
          {latest.map((l, i) => (
            <StaggerItem key={l.name} className={`px-4 py-4 ${i > 0 ? 'border-t border-stamp sm:border-l sm:border-t-0' : ''}`}>
              <p className="font-bold leading-snug">{l.name}</p>
              <p className="mt-1 text-[14px] text-ink-2">{l.note}</p>
              <p className="figure mt-2 font-mono text-[12px] text-stamp">{l.date}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* depth: radar and its legend */}
      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* side room so the outer axis labels never touch the screen edge */}
        <div className="px-10 sm:px-14 lg:px-8">
          <Radar items={proficiency} active={active} setActive={setActive} />
        </div>
        <div>
          <p className="label">Depth · core skills</p>
          <ul className="mt-3 border-t border-ink" onPointerLeave={() => setActive(null)}>
            {proficiency.map((p, k) => (
              <li key={p.name} className="border-b border-rule">
                <button
                  type="button"
                  onPointerEnter={() => setActive(k)}
                  onFocus={() => setActive(k)}
                  onBlur={() => setActive(null)}
                  aria-label={`${p.name}: ${p.level}`}
                  className={`flex min-h-[48px] w-full items-center justify-between gap-4 px-3 py-3 text-left transition-colors ${
                    active === k ? 'bg-stamp-wash' : 'hover:bg-stamp-wash'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 border-2 border-stamp transition-colors ${active === k ? 'bg-stamp' : ''}`} />
                    <span className="text-[16px] font-medium">{p.name}</span>
                  </span>
                  <Rank level={p.level} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* breadth: every skill, by area */}
      <div className="mt-16">
        <p className="label">Breadth · by area</p>
        <div className="mt-3 grid border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {skillCats.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} className="border-b border-r border-ink p-4">
              <h3 className="font-bold" style={{ fontStretch: '112%' }}>
                {c.label}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {skillCloud
                  .filter((s) => s[1] === c.id)
                  .map(([name, , w]) => (
                    <li key={name} className={`text-[15px] ${w === 3 ? 'font-semibold' : 'text-ink-2'}`}>
                      {name}
                      {latest.some((l) => l.name === name) && (
                        <span className="ml-2 bg-stamp px-1.5 py-0.5 align-middle font-mono text-[10px] font-semibold text-on-ink">NEW</span>
                      )}
                    </li>
                  ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
