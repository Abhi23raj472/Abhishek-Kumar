import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

export const ease = [0.22, 1, 0.36, 1]
export const isServer = typeof window === 'undefined'

/** Fade + rise into view, once. */
export function Reveal({ children, delay = 0, y = 18, className = '', as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, ease, delay }}
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
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </M>
  )
}

export const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export function StaggerItem({ children, className = '', as = 'div', variants = rise, ...rest }) {
  const M = motion[as]
  return (
    <M className={className} variants={variants} {...rest}>
      {children}
    </M>
  )
}

/** Text that slides up out of a mask when it scrolls into view. */
export function MaskUp({ children, delay = 0, className = '' }) {
  return (
    // The wrapper is what's watched: the text starts outside its own clip box,
    // where it would never count as on screen.
    <motion.span
      className={`block overflow-hidden pb-[0.08em] ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
    >
      <motion.span
        className="block"
        // opacity is part of the start state so the prerender step can un-hide it
        variants={{ hidden: { y: '105%', opacity: 0 }, show: { y: '0%', opacity: 1 } }}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

/** Number that counts up when scrolled into view. */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  // The build-time render shows the final figure, so crawlers read real numbers.
  const [val, setVal] = useState(isServer ? to : 0)
  useEffect(() => {
    if (!inView) return
    if (reduce || to === 0) {
      setVal(to)
      return
    }
    const c = animate(0, to, { duration: 1.4, ease, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, reduce])
  return (
    <span ref={ref} className={`figure ${className}`}>
      {val}
      {suffix}
    </span>
  )
}

/** A check mark that draws itself, used wherever an item counts as verified. */
export function Check({ on = true, delay = 0, className = '' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <motion.path
        d="M4 10.5 8.2 14.5 16 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="square"
        initial={{ pathLength: isServer ? 1 : 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.45, ease, delay }}
      />
    </svg>
  )
}

/**
 * One numbered report section: a heavy rule, the section number and name in
 * the left margin, and the title and content to the right.
 */
export function Section({ id, no, label, title, intro, children }) {
  return (
    <section id={id} className="pad border-t-2 border-ink py-16 md:py-24">
      <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
        <Reveal className="flex items-baseline gap-3 md:block">
          <p className="figure font-mono text-[13px] font-medium text-stamp">§ {no}</p>
          <p className="label md:mt-2">{label}</p>
        </Reveal>
        <div className="min-w-0">
          <h2 className="display max-w-[22ch] text-[clamp(1.9rem,4.4vw,3.4rem)]">
            <MaskUp>{title}</MaskUp>
          </h2>
          {intro && (
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-ink-2">{intro}</p>
            </Reveal>
          )}
          <div className="mt-10 md:mt-14">{children}</div>
        </div>
      </div>
    </section>
  )
}
