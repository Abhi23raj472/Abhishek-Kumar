import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { profile, roles } from '../data'
import { Magnetic, Roll, ease } from '../lib/motion'

const resume = `./${profile.resume}`
const inOut = [0.65, 0, 0.35, 1]
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*+'

/** Letters drift up out of a blur, one after another. */
function Letters({ text, ready, intro, delay = 0 }) {
  return (
    <span aria-hidden className="inline-flex">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={intro ? { opacity: 0, y: '0.4em', filter: 'blur(10px)' } : false}
          animate={ready ? { opacity: 1, y: '0em', filter: 'blur(0px)' } : undefined}
          transition={{ duration: 0.9, ease: inOut, delay: delay + i * 0.04 }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

/** Text that resolves out of random glyphs, like a signal locking on. */
function Decode({ text, run, delay = 0 }) {
  const reduce = useReducedMotion()
  const [out, setOut] = useState(reduce ? text : '')
  useEffect(() => {
    if (!run || reduce) {
      if (reduce) setOut(text)
      return
    }
    let frame = 0
    let id
    const start = setTimeout(() => {
      id = setInterval(() => {
        frame++
        const locked = Math.floor(frame / 2)
        setOut(
          [...text]
            .map((ch, i) => (ch === ' ' || i < locked ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(''),
        )
        if (locked >= text.length) clearInterval(id)
      }, 30)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(id)
    }
  }, [text, run, delay, reduce])
  return <span aria-hidden>{out || ' '}</span>
}

/** Cycles through focus areas, decoding each one in. */
function RoleTicker({ run }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!run) return
    const t = setInterval(() => setI((v) => (v + 1) % roles.length), 3200)
    return () => clearInterval(t)
  }, [run])
  return <Decode key={i} text={roles[i]} run={run} delay={i === 0 ? 0.6 : 0} />
}

/** A small satellite on a tilted orbit around the name, passing behind it on the far side. */
function Satellite({ reduce }) {
  const angle = useMotionValue(Math.PI * 0.15)
  useAnimationFrame((_, delta) => {
    if (!reduce) angle.set(angle.get() + delta * 0.00035)
  })
  const left = useTransform(angle, (a) => `${50 + Math.cos(a) * 54}%`)
  const top = useTransform(angle, (a) => `${50 + Math.sin(a) * 42}%`)
  const front = useTransform(angle, (a) => Math.sin(a) > 0)
  const z = useTransform(front, (f) => (f ? 3 : 0))
  const scale = useTransform(angle, (a) => 0.7 + (Math.sin(a) + 1) * 0.18)
  const opacity = useTransform(angle, (a) => 0.45 + (Math.sin(a) + 1) * 0.27)
  return (
    <motion.div aria-hidden className="pointer-events-none absolute" style={{ left, top, zIndex: z }}>
      <motion.svg viewBox="0 0 64 28" className="-ml-6 -mt-3 w-12" style={{ scale, opacity }}>
        <rect x="1" y="9" width="20" height="10" rx="1" fill="#16264d" stroke="#8fc4ff" strokeWidth="1" />
        <rect x="43" y="9" width="20" height="10" rx="1" fill="#16264d" stroke="#8fc4ff" strokeWidth="1" />
        <path d="M8 9v10M14 9v10M50 9v10M56 9v10" stroke="#8fc4ff" strokeWidth="0.6" />
        <path d="M21 14h5M38 14h5" stroke="#cfdcf3" strokeWidth="1.2" />
        <rect x="26" y="7" width="12" height="14" rx="2" fill="#dfe7f5" />
        <rect x="28.5" y="10" width="7" height="4" rx="0.8" fill="#3b6fd8" />
        <path d="M32 7V3" stroke="#dfe7f5" strokeWidth="1" />
        <circle cx="32" cy="2.5" r="1.4" fill="#f2c27b" />
      </motion.svg>
    </motion.div>
  )
}

export default function Hero({ ready, intro = true }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Scrolling away lifts the content and fades it into the sky.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const lift = useTransform(p, [0, 1], ['0%', '-30%'])
  const fade = useTransform(p, [0, 0.6], [1, 0])

  const show = (delay) => ({
    initial: intro ? { opacity: 0, y: 16 } : false,
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, ease, delay },
  })

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh flex-col pb-[22svh] pt-28">
      <motion.div style={reduce ? undefined : { y: lift, opacity: fade }} className="shell flex flex-1 flex-col items-center justify-center text-center">
        <motion.p {...show(0.7)} className="label inline-flex items-center gap-2.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.company} · {profile.location}
        </motion.p>

        <div className="relative mt-6 isolate">
          <motion.svg
            aria-hidden
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -inset-x-[8%] -inset-y-[20%] -z-10 h-[140%] w-[116%]"
            initial={intro ? { opacity: 0 } : false}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <ellipse cx="50" cy="20" rx="46" ry="16" fill="none" stroke="rgb(143 196 255 / 0.18)" strokeWidth="0.15" strokeDasharray="0.6 0.9" vectorEffect="non-scaling-stroke" />
          </motion.svg>
          <h1 className="relative z-[1] font-display text-[clamp(3.25rem,10vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.01em]">
            <span className="sr-only">Abhishek Kumar, {profile.role}</span>
            <Letters text="Abhishek" ready={ready} intro={intro} delay={0.05} />{' '}
            <span className="italic text-accent">
              <Letters text="Kumar" ready={ready} intro={intro} delay={0.25} />
            </span>
          </h1>
          {ready && <Satellite reduce={reduce} />}
        </div>

        <motion.p {...show(0.5)} className="mt-6 max-w-lg text-base leading-relaxed text-mute md:text-lg">
          <span className="text-fg">Quality Engineer</span> building scalable test automation for web, desktop and API
          experiences, so teams release with speed and confidence.
        </motion.p>

        <motion.p {...show(0.6)} className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-mute">
          <span className="sr-only">Focus: {roles.join(', ')}</span>
          Focus ▸ <span className="text-accent"><RoleTicker run={ready} /></span>
        </motion.p>

        <motion.div {...show(0.7)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink">
              <Roll>Explore the mission</Roll>
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </Magnetic>
          <Magnetic>
            <a href={resume} download className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent">
              <Roll>Resume</Roll> <Download size={15} />
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        {...show(0.9)}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-mute hover:text-fg"
        aria-label="Scroll to about"
      >
        <span className="label">Scroll</span>
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.a>
    </section>
  )
}
