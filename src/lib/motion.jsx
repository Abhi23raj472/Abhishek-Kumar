import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useSpring,
} from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]

/** Fade + rise into view, once. */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
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
  hidden: { opacity: 0, y: 20 },
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

const charRise = {
  hidden: { opacity: 0, y: '0.7em', rotate: 10, transition: { duration: 0.3 } },
  show: { opacity: 1, y: '0em', rotate: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } },
}

/**
 * Title whose letters rise and untwist one after another as it enters the
 * viewport. It plays once and then stays put, so a title never sits hidden.
 */
export function SplitChars({ text, highlight = [], className = '' }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.018 } } }}
      >
        {words.map((w, i) => (
          <span key={i} className={`mr-[0.24em] inline-block whitespace-nowrap ${highlight.includes(bare(w)) ? 'italic text-accent' : ''}`}>
            {[...w].map((ch, j) => (
              <motion.span key={j} className="inline-block origin-bottom-left" variants={charRise}>
                {ch}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

const wordRise = {
  hidden: { opacity: 0, y: '1.2em', transition: { duration: 0.3 } },
  show: { opacity: 1, y: '0em', transition: { duration: 0.9, ease } },
}

/** Paragraph whose words rise in with a quick stagger when it scrolls into view. */
export function RevealWords({ text, className = '', as = 'p', delay = 0 }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.012, delayChildren: delay } } }}
    >
      <span className="sr-only">{text}</span>
      {text.split(' ').map((w, i) => (
        <motion.span key={i} aria-hidden className="mr-[0.26em] inline-block" variants={wordRise}>
          {w}
        </motion.span>
      ))}
    </M>
  )
}

/** Link label that rolls up to an identical copy on hover (styles in index.css). */
export function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll-in">
        {children}
        <span aria-hidden>{children}</span>
      </span>
    </span>
  )
}

/** Leans toward the pointer (mouse only). */
export function Magnetic({ children, strength = 0.2, className = '' }) {
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
    <div className={`mb-10 md:mb-14 ${className}`}>
      <Reveal className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
        <span className="text-accent">{index}</span>
        <span>{kicker}</span>
        <motion.span
          className="h-px flex-1 origin-left bg-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
        />
      </Reveal>
      <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.01em]">
        <SplitChars text={title} highlight={highlight} />
      </h2>
      {typeof sub === 'string' ? (
        <RevealWords text={sub} delay={0.2} className="mt-4 max-w-xl text-base leading-relaxed text-mute" />
      ) : (
        sub && (
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">{sub}</p>
          </Reveal>
        )
      )}
    </div>
  )
}
