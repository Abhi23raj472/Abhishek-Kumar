import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { proficiency, skillCats, skillCloud } from '../data'
import { Counter, SectionHead, ease } from '../lib/motion'

const sizes = { 1: 'text-[13px]', 2: 'text-[15px]', 3: 'text-lg font-medium' }

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
        node.style.opacity = ((0.18 + depth * 0.82) * (match ? 1 : 0.22)).toFixed(3)
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

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <TagSphere filter={filter} />
          <p className="label mt-2 text-center">Drag to spin</p>
        </div>

        <div className="panel rounded-2xl p-6">
          <p className="label">Proficiency</p>
          <ul className="mt-5 space-y-5">
            {proficiency.map((p, i) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span>{p.name}</span>
                  <span className="font-mono text-xs text-mute">
                    <Counter to={p.pct} suffix="%" />
                  </span>
                </div>
                <div className="mt-2 h-px bg-line" role="presentation">
                  <motion.div
                    className="h-px origin-left bg-accent shadow-[0_0_8px_var(--accent)]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: p.pct / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease, delay: 0.1 + i * 0.1 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
