import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

/** Fade + rise into view once. */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </M>
  )
}

/** Parent that staggers its <StaggerItem> children. */
export function Stagger({ children, className = '', gap = 0.08, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export const item = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export function StaggerItem({ children, className = '', ...rest }) {
  return (
    <motion.div className={className} variants={item} {...rest}>
      {children}
    </motion.div>
  )
}

/** Card with a pointer-tracking glow and border highlight. */
export function Spotlight({ children, className = '', ...rest }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => ref.current.style.setProperty('--o', 1)}
      onPointerLeave={() => ref.current.style.setProperty('--o', 0)}
      className={`spotlight relative rounded-3xl border border-line bg-panel ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Element that leans toward the pointer. */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  const move = (e) => {
    if (reduce) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={move}
      onPointerLeave={() => { x.set(0); y.set(0) }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}

/** Number that counts up when scrolled into view. */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to ?? 0 : 0)
  useEffect(() => {
    if (!inView || to == null) return
    if (reduce) { setVal(to); return }
    const c = animate(0, to, { duration: 1.4, ease, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, reduce])
  return (
    <span ref={ref} className={className}>
      {to == null ? '—' : (val ?? 0).toLocaleString()}
      {suffix}
    </span>
  )
}

export function SectionHead({ index, kicker, title, sub }) {
  return (
    <div className="mb-10 md:mb-14">
      <Reveal className="flex items-center gap-3 font-mono text-xs text-pass">
        <span className="rounded-md border border-pass/30 bg-pass/10 px-2 py-0.5">{index}</span>
        <span className="uppercase tracking-[0.2em] text-mute">{kicker}</span>
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-line-2 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.2 }}
        />
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.14}>
          <p className="mt-4 max-w-2xl text-base md:text-lg">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}
