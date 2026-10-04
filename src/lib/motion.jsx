import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

/** Fade + rise into view, once. */
export function Reveal({ children, delay = 0, y = 32, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </M>
  )
}

/** Parent that staggers <StaggerItem> children into view. */
export function Stagger({ children, className = '', gap = 0.07, delay = 0, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </M>
  )
}

export const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export function StaggerItem({ children, className = '', as = 'div', variants = rise, ...rest }) {
  const M = motion[as]
  return (
    <M className={className} variants={variants} {...rest}>
      {children}
    </M>
  )
}

const bare = (w) => w.replace(/[.,!?;:—]/g, '')

/** Words rise out of a mask one after another. Screen readers get the plain text. */
export function SplitWords({ text, highlight = [], delay = 0, className = '' }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="-mb-[0.12em] mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${highlight.includes(bare(w)) ? 'text-accent' : ''}`}
              variants={{
                hidden: { y: '110%', rotate: 4 },
                show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  )
}

function ScrollWord({ children, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${accent ? 'text-accent' : ''}`}>
      {children}
    </motion.span>
  )
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollText({ text, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((raw, i) => {
        const accent = raw.startsWith('*')
        const w = raw.replaceAll('*', '')
        if (reduce) return <span key={i} className={`mr-[0.25em] inline-block ${accent ? 'text-accent' : ''}`}>{w}</span>
        const start = i / words.length
        return (
          <ScrollWord key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} accent={accent}>
            {w}
          </ScrollWord>
        )
      })}
    </p>
  )
}

/** Leans toward the pointer (mouse only). */
export function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 })
  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={reset} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

/** Number that counts up when scrolled into view. */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView || to == null) return
    if (reduce) {
      setVal(to)
      return
    }
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, reduce])
  return (
    <span ref={ref} className={className}>
      {to == null ? '—' : val.toLocaleString()}
      {suffix}
    </span>
  )
}

/** Numbered section heading with a line that draws in and a word-by-word title. */
export function SectionHead({ index, kicker, title, highlight = [], sub, className = '' }) {
  return (
    <div className={`mb-12 md:mb-20 ${className}`}>
      <Reveal className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute">
        <span className="text-accent">({index})</span>
        <span>{kicker}</span>
        <motion.span
          className="h-px flex-1 origin-left bg-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
        />
      </Reveal>
      <h2 className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
        <SplitWords text={title} highlight={highlight} />
      </h2>
      {sub && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}
