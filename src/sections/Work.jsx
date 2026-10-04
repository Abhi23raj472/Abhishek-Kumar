import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Bug, Cpu, Layers3, Webhook } from 'lucide-react'
import { doing } from '../data'
import { SectionHead, Stagger, StaggerItem } from '../lib/motion'

const icons = [Layers3, Webhook, Cpu, Bug]
const tones = ['bg-surface border border-line', 'bg-surface-2 border border-line']

function Card({ d, i, progress }) {
  const Icon = icons[i % icons.length]
  // Each card's index drifts against the scroll for a bit of depth.
  const numX = useTransform(progress, [0, 1], ['0%', `${-20 - i * 8}%`])
  return (
    <article
      className={`relative flex h-[min(52svh,420px)] w-[80vw] shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-7 sm:w-[56vw] md:p-8 lg:w-[30vw] lg:max-w-[400px] ${tones[i % tones.length]}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{d.code}</span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg">
          <Icon size={18} strokeWidth={1.5} />
        </span>
      </div>
      <motion.span
        aria-hidden
        style={{ x: numX }}
        className="pointer-events-none absolute -bottom-6 right-2 text-[clamp(6rem,10vw,8.5rem)] font-bold leading-none tracking-[-0.06em] text-fg/[0.05]"
      >
        0{i + 1}
      </motion.span>
      <div className="relative">
        <h3 className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">{d.title}</h3>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mute">{d.body}</p>
      </div>
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

  const head = (
    <SectionHead
      index="02"
      kicker="What I do"
      title="Quality, engineered end to end."
      highlight={['end', 'to', 'end.']}
      sub="Four ways I turn complex testing needs into dependable releases."
      className="mb-0!"
    />
  )

  if (reduce) {
    return (
      <section id="work" className="shell py-24 md:py-32">
        {head}
        <Stagger className="mt-10 grid gap-4 md:grid-cols-2">
          {doing.map((d, i) => (
            <StaggerItem key={d.code} className={`rounded-2xl p-7 ${tones[i % tones.length]}`}>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">{d.code}</span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight">{d.title}</h3>
              <p className="mt-2 text-[15px] text-mute">{d.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    )
  }

  return (
    <section id="work" ref={target} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-4 px-5 md:gap-5 md:px-10 xl:pl-[max(2.5rem,calc((100vw-1200px)/2+2.5rem))]">
          <div className="w-[80vw] shrink-0 pr-6 sm:w-[56vw] lg:w-[30vw] lg:max-w-[400px]">{head}</div>
          {doing.map((d, i) => (
            <Card key={d.code} d={d} i={i} progress={scrollYProgress} />
          ))}
        </motion.div>

        <div className="shell mt-10 flex items-center gap-4 font-mono text-[11px] text-mute" aria-hidden>
          <span>01</span>
          <div className="h-px flex-1 bg-line">
            <motion.div className="h-px origin-left bg-fg" style={{ scaleX: scrollYProgress }} />
          </div>
          <span>0{doing.length}</span>
        </div>
      </div>
    </section>
  )
}
