import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Bug, Cpu, Layers3, Webhook } from 'lucide-react'
import { doing } from '../data'
import { SectionHead, Stagger, StaggerItem } from '../lib/motion'

const icons = [Layers3, Webhook, Cpu, Bug]
const tones = [
  'bg-surface text-fg border border-line',
  'bg-lime text-on-lime',
  'bg-surface-2 text-fg border border-line',
  'bg-violet text-on-violet',
]

function Card({ d, i, progress, total }) {
  const Icon = icons[i % icons.length]
  // Each card's big number drifts against the scroll for a bit of depth.
  const numX = useTransform(progress, [0, 1], ['0%', `${-30 - i * 10}%`])
  return (
    <article
      className={`relative flex h-[min(62svh,560px)] w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:w-[60vw] md:p-10 lg:w-[38vw] ${tones[i % tones.length]}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">{d.code}</span>
        <span className="grid h-14 w-14 place-items-center rounded-full border border-current/20">
          <Icon size={24} strokeWidth={1.5} />
        </span>
      </div>
      <motion.span
        aria-hidden
        style={{ x: numX }}
        className="pointer-events-none absolute -bottom-10 right-0 font-display text-[clamp(10rem,22vw,20rem)] font-bold leading-none tracking-[-0.08em] opacity-10"
      >
        0{i + 1}
      </motion.span>
      <div className="relative">
        <h3 className="font-display text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-[1] tracking-[-0.04em]">{d.title}</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed opacity-80 md:text-lg">{d.body}</p>
      </div>
      <span className="sr-only">
        {i + 1} of {total}
      </span>
    </article>
  )
}

/**
 * Pinned horizontal scroll: the section sticks to the viewport while vertical
 * scrolling slides the card track sideways.
 */
export default function Work() {
  const reduce = useReducedMotion()
  const target = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  const distMV = useMotionValue(0)

  useLayoutEffect(() => {
    if (reduce) return
    const measure = () => {
      const d = Math.max(0, track.current.scrollWidth - window.innerWidth)
      distMV.set(d)
      setDist(d)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [reduce, distMV])

  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const x = useSpring(
    useTransform(() => -scrollYProgress.get() * distMV.get()),
    { stiffness: 260, damping: 40, mass: 0.2 },
  )

  if (reduce) {
    return (
      <section id="work" className="shell py-24 md:py-32">
        <SectionHead index="02" kicker="What I do" title="Quality, engineered end to end." highlight={['engineered']} />
        <Stagger className="grid gap-4 md:grid-cols-2">
          {doing.map((d, i) => (
            <StaggerItem key={d.code} className={`rounded-[2rem] p-8 ${tones[i % tones.length]}`}>
              <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">{d.code}</span>
              <h3 className="mt-10 font-display text-3xl font-semibold tracking-tight">{d.title}</h3>
              <p className="mt-3 opacity-80">{d.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    )
  }

  return (
    <section id="work" ref={target} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-5 px-5 md:gap-6 md:px-10">
          <div className="flex w-[82vw] shrink-0 flex-col justify-center sm:w-[60vw] lg:w-[34vw]">
            <SectionHead
              index="02"
              kicker="What I do"
              title="Quality, engineered end to end."
              highlight={['engineered']}
              sub="Scroll on — four ways I turn complex testing needs into dependable releases."
              className="mb-0!"
            />
          </div>
          {doing.map((d, i) => (
            <Card key={d.code} d={d} i={i} progress={scrollYProgress} total={doing.length} />
          ))}
        </motion.div>

        <div className="shell mt-8 flex items-center gap-4 font-mono text-xs text-mute md:mt-12" aria-hidden>
          <span>01</span>
          <div className="h-px flex-1 bg-line">
            <motion.div className="h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
          </div>
          <span>0{doing.length}</span>
        </div>
      </div>
    </section>
  )
}
