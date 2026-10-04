import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { proficiency, skillCats, skillCloud } from '../data'
import { SectionHead, ease } from '../lib/motion'

const sizes = { 1: 'text-[13px]', 2: 'text-[15px]', 3: 'text-lg font-medium' }

// Proficiency reads as cockpit dials and rank chevrons instead of a percentage.
const RANKS = { expert: 3, advanced: 2, proficient: 1 }
const START = -135 // dial sweep, in degrees clockwise from 12 o'clock
const SWEEP = 270

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

const polar = (deg, r) => {
  const a = (deg * Math.PI) / 180
  return [60 + r * Math.sin(a), 60 - r * Math.cos(a)]
}
const arc = (r, from, to) => {
  const [x0, y0] = polar(from, r)
  const [x1, y1] = polar(to, r)
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}
const TICKS = Array.from({ length: 28 }, (_, k) => START + (SWEEP / 27) * k)

/**
 * A cockpit dial: the arc sweeps up to the reading, ticks light in sequence,
 * and the needle swings over with a little overshoot, then keeps a faint
 * live tremor.
 */
function Dial({ p, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const reading = START + (SWEEP * p.pct) / 100
  const delay = 0.15 + i * 0.12
  const on = reduce || inView

  return (
    <div ref={ref} className="flex flex-col items-center text-center" aria-label={`${p.name}: ${p.level}`} role="img">
      <svg viewBox="0 0 120 120" className="w-full max-w-[150px] overflow-visible" aria-hidden>
        {/* bezel */}
        <circle cx="60" cy="60" r="56" fill="var(--stage)" stroke="var(--line)" strokeWidth="1" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="var(--line)" strokeWidth="0.6" strokeDasharray="1 2.5" />
        {/* ticks */}
        {TICKS.map((deg, k) => {
          const major = k % 9 === 0
          const [x0, y0] = polar(deg, major ? 37 : 39.5)
          const [x1, y1] = polar(deg, 43)
          const lit = deg <= reading + 0.01
          return (
            <motion.line
              key={k}
              x1={x0} y1={y0} x2={x1} y2={y1}
              strokeWidth={major ? 1.6 : 1}
              strokeLinecap="round"
              initial={{ stroke: 'var(--line)' }}
              animate={on && lit ? { stroke: 'var(--accent)' } : undefined}
              transition={{ duration: 0.2, delay: reduce ? 0 : delay + 0.25 + (k / 27) * 1.1 }}
            />
          )
        })}
        {/* track and value arc */}
        <path d={arc(49, START, START + SWEEP)} fill="none" stroke="var(--line)" strokeWidth="2.5" strokeLinecap="round" />
        <motion.path
          d={arc(49, START, START + SWEEP)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 4px color-mix(in srgb, var(--accent) 70%, transparent))' }}
          initial={{ pathLength: reduce ? p.pct / 100 : 0 }}
          animate={on ? { pathLength: p.pct / 100 } : undefined}
          transition={{ duration: 1.4, ease, delay: delay + 0.2 }}
        />
        {/* needle: the invisible circle centres the group's box on the hub, so it pivots there */}
        <motion.g
          initial={{ rotate: reduce ? reading : START }}
          animate={on ? { rotate: reading } : undefined}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 55, damping: 7, delay: delay + 0.2 }}
        >
          <motion.g
            animate={on && !reduce ? { rotate: [0, 1.4, -0.8, 0.6, 0] } : undefined}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 0.6, delay: delay + 2.4, ease: 'easeInOut' }}
          >
            <circle cx="60" cy="60" r="44" fill="none" />
            <line x1="60" y1="66" x2="60" y2="21" stroke="var(--fg)" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="60" cy="21" r="1.6" fill="var(--accent)" />
          </motion.g>
        </motion.g>
        <circle cx="60" cy="60" r="5" fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.4" />
        {/* readout */}
        <text x="60" y="86" textAnchor="middle" className="fill-mute font-mono text-[6.5px] uppercase" letterSpacing="1.2">
          {p.level}
        </text>
      </svg>
      <p className="mt-3 text-sm leading-snug">{p.name}</p>
      <div className="mt-1.5">
        <Rank level={p.level} chevronsOnly />
      </div>
    </div>
  )
}

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function spherePoints(n) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
  }
  return pts
}

/**
 * Tags on a slowly turning sphere. Drag to spin it; it keeps some momentum.
 * Positions are written straight to the DOM each frame, outside React.
 */
function TagSphere({ filter }) {
  const reduce = useReducedMotion()
  const stage = useRef(null)
  const els = useRef([])
  const filterRef = useRef(filter)
  filterRef.current = filter
  const pts = useMemo(() => spherePoints(skillCloud.length), [])

  useEffect(() => {
    const el = stage.current
    let radius = 160
    const ro = new ResizeObserver(([e]) => {
      radius = Math.min(e.contentRect.width, e.contentRect.height) * 0.4
    })
    ro.observe(el)

    const rot = { x: -0.25, y: 0, vx: 0, vy: reduce ? 0 : 0.0025 }
    const drag = { on: false, px: 0, py: 0 }
    const auto = reduce ? 0 : 0.0025

    const down = (e) => {
      drag.on = true
      drag.px = e.clientX
      drag.py = e.clientY
      el.setPointerCapture(e.pointerId)
    }
    const move = (e) => {
      if (!drag.on) return
      const dx = e.clientX - drag.px
      const dy = e.clientY - drag.py
      drag.px = e.clientX
      drag.py = e.clientY
      rot.vy = dx * 0.006
      rot.vx = -dy * 0.006
    }
    const up = () => (drag.on = false)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!drag.on) {
        rot.vy += (auto - rot.vy) * 0.02
        rot.vx *= 0.94
      }
      rot.y += rot.vy
      rot.x = Math.max(-1.2, Math.min(1.2, rot.x + rot.vx))
      const cy = Math.cos(rot.y)
      const sy = Math.sin(rot.y)
      const cx = Math.cos(rot.x)
      const sx = Math.sin(rot.x)
      const f = filterRef.current
      pts.forEach(([x, y, z], i) => {
        const node = els.current[i]
        if (!node) return
        // Rotate about Y, then X.
        const x1 = x * cy + z * sy
        const z1 = -x * sy + z * cy
        const y2 = y * cx - z1 * sx
        const z2 = y * sx + z1 * cx
        const depth = (z2 + 1) / 2
        const scale = 0.62 + depth * 0.55
        const match = f === 'all' || node.dataset.cat === f
        node.style.transform = `translate(-50%, -50%) translate3d(${(x1 * radius).toFixed(1)}px, ${(y2 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`
        node.style.opacity = ((0.64 + depth * 0.36) * (match ? 1 : 0.35)).toFixed(3)
        node.style.zIndex = String(Math.round(depth * 100))
      })
    }
    frame()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [pts, reduce])

  return (
    <div
      ref={stage}
      className="relative mx-auto aspect-square w-full max-w-[520px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      role="img"
      aria-label={`Skills: ${skillCloud.map((s) => s[0]).join(', ')}`}
    >
      <div aria-hidden className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(77_141_255/0.1),transparent_65%)]" />
      {skillCloud.map(([name, cat, w], i) => (
        <span
          key={name}
          aria-hidden
          ref={(n) => (els.current[i] = n)}
          data-cat={cat}
          className={`absolute left-1/2 top-1/2 whitespace-nowrap transition-colors duration-300 ${sizes[w]} ${
            filter !== 'all' && filter === cat ? 'text-accent' : 'text-fg'
          }`}
        >
          {name}
        </span>
      ))}
    </div>
  )
}

export default function Skills() {
  const [filter, setFilter] = useState('all')
  return (
    <section id="skills" className="shell py-24 md:py-36">
      <SectionHead index="05" kicker="Skills" title="The toolkit, in full rotation." highlight={['rotation.']} />

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter skills">
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
        <TagSphere filter={filter} />
        <p className="label mt-2 text-center">Drag to spin</p>
      </div>

      <div className="panel mt-12 rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label">Flight instruments · proficiency</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
            {Object.entries(RANKS).map(([lvl, n]) => (
              <span key={lvl} className="inline-flex items-center gap-1.5">
                <span className="text-accent">{'▲'.repeat(n)}</span>
                {lvl}
              </span>
            ))}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
          {proficiency.map((p, i) => (
            <Dial key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
