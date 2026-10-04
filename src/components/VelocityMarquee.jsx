import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/**
 * A row that drifts on its own, then speeds up, flips direction and skews
 * with the speed and direction of the page scroll.
 */
function Row({ children, baseVelocity = 2 }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false })
  const skewX = useTransform(velocity, [-2000, 2000], [10, -10])
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    baseX.set(baseX.get() + move)
  })

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex flex-nowrap" style={{ x, skewX: reduce ? 0 : skewX }}>
        {[0, 1, 2, 3].map((k) => (
          <span key={k} aria-hidden={k > 0} className="flex shrink-0 items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function VelocityMarquee({ items }) {
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half)]
  return (
    <section aria-label="Tools I work with" className="relative overflow-hidden border-y border-line py-8 md:py-12">
      {rows.map((row, r) => (
        <Row key={r} baseVelocity={r === 0 ? -2 : 2}>
          {row.map((t) => (
            <span key={t} className="flex items-center">
              <span
                className={`px-5 font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[1.1] tracking-[-0.04em] md:px-8 ${
                  r === 1 ? 'outline-text' : ''
                }`}
              >
                {t}
              </span>
              <span className="text-[clamp(1.5rem,3vw,2.5rem)] text-accent">✦</span>
            </span>
          ))}
        </Row>
      ))}
    </section>
  )
}
