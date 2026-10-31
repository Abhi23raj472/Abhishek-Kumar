import { useRef, useState } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { latest, proficiency, skillCats, skillCloud } from '../data'
import { SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

// Proficiency reads as a radar scope and rank chevrons instead of a percentage.
const RANKS = { expert: 3, advanced: 2, proficient: 1 }
const C = 200 // radar centre in the 400 x 400 viewBox
const R = 150 // outer ring radius

/** Up to three chevrons, like rank insignia: filled ones mark the level. */
function Rank({ level, chevronsOnly = false }) {
  const n = RANKS[level] ?? 1
  return (
    <span className="flex items-center gap-2" aria-hidden>
      {!chevronsOnly && <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{level}</span>}
      <span className="flex flex-col-reverse gap-[2px]">
        {[1, 2, 3].map((k) => (
          <svg key={k} viewBox="0 0 12 5" className={`h-[6px] w-3.5 ${k <= n ? 'text-accent' : 'text-line'}`}>
            <path d="M1 4.5 6 1l5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

/** One skill's vertex: it flares as the scan line sweeps over it. Its hit circle centres the scale-in on the vertex. */
function Blip({ x, y, deg, sweep, active, delay, on, onHover }) {
  // Angular distance from the beam's leading edge to this axis, in degrees.
  const flare = useTransform(sweep, (s) => {
    const behind = (((s - deg) % 360) + 360) % 360
    return behind < 50 ? 1 - behind / 50 : 0
  })
  const glow = useTransform(flare, (f) => 6 + f * 14)
  const halo = useTransform(flare, (f) => 0.15 + f * 0.6)
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={on ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 14, delay }}
      onPointerEnter={onHover}
      className="cursor-pointer"
    >
      <circle cx={x} cy={y} r="18" fill="transparent" />
      <motion.circle cx={x} cy={y} r={glow} fill="var(--accent)" style={{ opacity: halo }} />
      <circle cx={x} cy={y} r={active ? 6.5 : 4.5} fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
      <circle cx={x} cy={y} r={active ? 2.6 : 1.8} fill="var(--accent)" />
    </motion.g>
  )
}

/**
 * The radar: every skill on its own axis, joined into one glowing shape
 * that grows out from the centre, with a scan line sweeping round and
 * each vertex flaring as the beam passes it.
 */
function Radar({ items, active, setActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()
  const on = reduce || inView
  const n = items.length
  const sweep = useMotionValue(0)
  useAnimationFrame((_, delta) => {
    if (!reduce && on) sweep.set((sweep.get() + delta * 0.06) % 360)
  })

  const verts = items.map((p, k) => point(axisDeg(k, n), (R * p.pct) / 100))
  const shape = verts.map((v) => v.join(',')).join(' ')
  const lead = point(0, R)
  const trail = point(-55, R)
  const current = active == null ? null : items[active]

  return (
    <svg ref={ref} viewBox="0 0 400 400" className="mx-auto block w-full max-w-[460px] overflow-visible" aria-hidden onPointerLeave={() => setActive(null)}>
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.32" />
        </radialGradient>
        <linearGradient id="radar-beam" gradientUnits="userSpaceOnUse" x1={trail[0]} y1={trail[1]} x2={lead[0]} y2={lead[1]}>
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* scope: rings, a fine circular graticule and the axes */}
      <circle cx={C} cy={C} r={R + 22} fill="var(--stage)" stroke="var(--line)" />
      <circle cx={C} cy={C} r={R + 10} fill="none" stroke="var(--line)" strokeDasharray="1 5" />
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(n, R * f)} fill="none" stroke="var(--line)" strokeWidth={f === 1 ? 1.2 : 0.8} />
      ))}
      {items.map((p, k) => {
        const [x, y] = point(axisDeg(k, n), R)
        return (
          <line
            key={p.name}
            x1={C} y1={C} x2={x} y2={y}
            stroke={active === k ? 'var(--accent)' : 'var(--line)'}
            strokeWidth={active === k ? 1.4 : 0.8}
            style={{ transition: 'stroke 0.25s' }}
          />
        )
      })}

      {/* sweeping beam; the invisible full circle keeps its pivot on the radar centre */}
      {!reduce && (
        <motion.g style={{ rotate: sweep }}>
          <circle cx={C} cy={C} r={R} fill="none" />
          <path d={`M ${C} ${C} L ${trail[0]} ${trail[1]} A ${R} ${R} 0 0 1 ${lead[0]} ${lead[1]} Z`} fill="url(#radar-beam)" />
          <line x1={C} y1={C} x2={lead[0]} y2={lead[1]} stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.8" />
        </motion.g>
      )}

      {/* the skills shape grows out from the centre (same invisible-circle pivot) */}
      <motion.g
        initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
        animate={on ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 70, damping: 11, delay: 0.2 }}
      >
        <circle cx={C} cy={C} r={R} fill="none" />
        <polygon
          points={shape}
          fill="url(#radar-fill)"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 55%, transparent))' }}
        />
      </motion.g>

      {verts.map(([x, y], k) => (
        <Blip
          key={items[k].name}
          x={x} y={y}
          deg={axisDeg(k, n)}
          sweep={sweep}
          active={active === k}
          on={on}
          delay={reduce ? 0 : 0.7 + k * 0.1}
          onHover={() => setActive(k)}
        />
      ))}

      {/* axis labels */}
      {items.map((p, k) => {
        const deg = axisDeg(k, n)
        const [x, y] = point(deg, R + 40)
        const anchor = Math.abs(Math.sin((deg * Math.PI) / 180)) < 0.2 ? 'middle' : Math.sin((deg * Math.PI) / 180) > 0 ? 'start' : 'end'
        return (
          <text
            key={p.name}
            x={x}
            y={y + 4}
            textAnchor={anchor}
            className={`font-mono text-[11px] uppercase transition-colors ${active === k ? 'fill-accent' : 'fill-mute'}`}
            letterSpacing="1"
            onPointerEnter={() => setActive(k)}
          >
            {p.short}
          </text>
        )
      })}

      {/* centre readout */}
      <circle cx={C} cy={C} r="34" fill="var(--bg)" stroke="var(--line)" />
      <text x={C} y={C - 3} textAnchor="middle" className="fill-fg font-display text-[15px] italic">
        {current ? current.short : 'Skills'}
      </text>
      <text x={C} y={C + 13} textAnchor="middle" className="fill-accent font-mono text-[8px] uppercase" letterSpacing="1.4">
        {current ? current.level : `${n} tracked`}
      </text>
    </svg>
  )
}

const tone = {
  3: 'border-accent/60 bg-accent/10 text-fg shadow-[0_0_18px_-6px_var(--accent)]',
  2: 'border-line bg-fg/[0.04] text-fg',
  1: 'border-line text-mute',
}

/**
 * Star catalogue: one panel per area, skills as stars of three magnitudes.
 * Picking an area brightens its panel and dims the rest.
 */
function Catalogue({ filter }) {
  return (
    <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
      {skillCats.map((c) => {
        const on = filter === 'all' || filter === c.id
        const items = skillCloud.filter((s) => s[1] === c.id)
        return (
          <StaggerItem key={c.id} className="h-full">
            <motion.div
              animate={{ opacity: on ? 1 : 0.35, scale: on ? 1 : 0.98 }}
              transition={{ duration: 0.35, ease }}
              className={`panel h-full rounded-2xl p-5 transition-colors ${filter === c.id ? 'border-accent/50' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl">{c.label}</h3>
                <span className="font-mono text-[11px] text-mute">×{items.length}</span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {items.map(([name, , w]) => (
                  <li
                    key={name}
                    className={`rounded-full border px-2.5 py-1 text-[13px] transition-colors hover:border-accent hover:text-fg ${tone[w]}`}
                  >
                    {name}
                    {latest.some((l) => l.name === name) && <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider text-accent">new</span>}
                  </li>
                ))}
              </ul>
            </motion.div>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}

/** The newest additions, each lighting up like a fresh signal. */
function Latest() {
  return (
    <div className="panel relative overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="label">Latest additions · 2026</span>
      </div>
      <Stagger className="grid sm:grid-cols-3" gap={0.12}>
        {latest.map((l, i) => (
          <StaggerItem key={l.name} className={`px-5 py-5 ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}>
            <p className="font-display text-2xl leading-tight">{l.name}</p>
            <p className="mt-1.5 text-sm text-mute">{l.note}</p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{l.when}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

export default function Skills() {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  return (
    <section id="skills" className="shell py-24 md:py-36">
      <SectionHead
        index="05"
        kicker="Skills"
        title="The toolkit, charted by area."
        highlight={['charted']}
        sub="What I've added most recently, everything I work with, and how deep the core skills go."
      />

      <Latest />

      <div className="mt-12 flex flex-wrap gap-1.5" role="group" aria-label="Filter skills">
        {[{ id: 'all', label: 'All' }, ...skillCats].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            aria-pressed={filter === c.id}
            className={`relative rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
              filter === c.id ? 'border-transparent text-on-ink' : 'border-line text-mute hover:text-fg'
            }`}
          >
            {filter === c.id && (
              <motion.span layoutId="skill-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Catalogue filter={filter} />
      </div>

      <div className="panel mt-12 rounded-2xl p-6 md:p-8">
        <p className="label">Radar · proficiency</p>
        <div className="mt-6 grid items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* side room so the outer axis labels never touch the screen edge */}
          <div className="px-9 sm:px-12 md:px-8">
            <Radar items={proficiency} active={active} setActive={setActive} />
          </div>
          <ul className="space-y-1" onPointerLeave={() => setActive(null)}>
            {proficiency.map((p, k) => (
              <li key={p.name}>
                <button
                  type="button"
                  onPointerEnter={() => setActive(k)}
                  onFocus={() => setActive(k)}
                  onBlur={() => setActive(null)}
                  aria-label={`${p.name}: ${p.level}`}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                    active === k ? 'border-accent/60 bg-accent/10' : 'border-transparent hover:bg-fg/[0.04]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full transition-colors ${active === k ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-line'}`} />
                    <span className="text-[15px]">{p.name}</span>
                  </span>
                  <Rank level={p.level} />
                </button>
              </li>
            ))}
            <li className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              {Object.entries(RANKS).map(([lvl, n]) => (
                <span key={lvl} className="inline-flex items-center gap-1.5">
                  <span className="text-accent">{'▲'.repeat(n)}</span>
                  {lvl}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
