import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from 'framer-motion'
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { profile, roles } from '../data'
import { Magnetic, Roll, ease } from '../lib/motion'

const resume = `${import.meta.env.BASE_URL}${profile.resume}`

const inOut = [0.65, 0, 0.35, 1]

/** Letters drift up out of a blur, one after another. */
function Letters({ text, ready, delay = 0 }) {
  return (
    <span aria-hidden className="inline-flex">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: '0.5em', filter: 'blur(8px)' }}
          animate={ready ? { opacity: 1, y: '0em', filter: 'blur(0px)' } : undefined}
          transition={{ duration: 1.2, ease: inOut, delay: delay + i * 0.03 }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

const swap = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.7, ease: inOut } },
  exit: { y: '-110%', transition: { duration: 0.7, ease: inOut } },
}

/** Each role rolls out letter by letter while the next rolls in behind it. */
function RoleRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % roles.length), 3200)
    return () => clearInterval(t)
  }, [])
  return (
    <span aria-hidden className="relative block h-[1.4em] overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          className="absolute inset-x-0 top-0 whitespace-nowrap"
          initial="hidden"
          animate="show"
          exit="exit"
          variants={{ show: { transition: { staggerChildren: 0.025 } }, exit: { transition: { staggerChildren: 0.025 } } }}
        >
          {[...roles[i]].map((ch, j) => (
            <motion.span key={j} className="inline-block" variants={swap}>
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const lede =
  'building scalable test automation for web, desktop and API experiences, so teams release with speed and confidence.'

/** Circular text badge: spins slowly, and faster as you scroll. */
function Badge({ reduce }) {
  const { scrollY } = useScroll()
  const time = useTime()
  const rotate = useTransform(() => (reduce ? 0 : time.get() / 90 + scrollY.get() * 0.2))
  const r = 78
  return (
    <a href="#about" aria-label="Scroll to about section" className="group relative grid h-28 w-28 shrink-0 place-items-center">
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ rotate }} aria-hidden>
        <defs>
          <path id="badge-circle" d={`M100,100 m-${r},0 a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <text className="fill-mute font-mono text-[13px] uppercase">
          <textPath href="#badge-circle" textLength={2 * Math.PI * r - 6} lengthAdjust="spacing">
            Quality Engineer · Tosca Automation · 5+ Years ·
          </textPath>
        </text>
      </motion.svg>
      <span className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:bg-ink group-hover:text-on-ink">
        <ArrowDown size={16} />
      </span>
    </a>
  )
}

export default function Hero({ ready }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Soft cursor-following glow behind the type.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const gx = useSpring(mx, { stiffness: 80, damping: 20 })
  const gy = useSpring(my, { stiffness: 80, damping: 20 })
  const glow = useMotionTemplate`radial-gradient(520px circle at ${gx}px ${gy}px, var(--glow), transparent 70%)`
  useEffect(() => {
    mx.set(window.innerWidth * 0.65)
    my.set(window.innerHeight * 0.45)
  }, [mx, my])
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  // Scrolling away slides the two name lines apart and lifts the content.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const line1 = useTransform(p, [0, 1], ['0%', '-12%'])
  const line2 = useTransform(p, [0, 1], ['0%', '12%'])
  const lift = useTransform(p, [0, 1], ['0%', '25%'])
  const fade = useTransform(p, [0, 0.75], [1, 0])
  const motionStyle = (s) => (reduce ? undefined : s)

  const show = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease, delay },
  })

  return (
    <section ref={ref} id="top" onPointerMove={onMove} className="relative isolate flex min-h-svh flex-col overflow-hidden pb-10 pt-24 md:pt-28">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: glow }} />

      <motion.div style={motionStyle({ y: lift, opacity: fade })} className="shell flex flex-1 flex-col justify-center gap-12 md:gap-16">
        <motion.div {...show(0.1)} className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-fg">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Open to new roles
          </span>
          <span>{profile.company} · {profile.location}</span>
        </motion.div>

        <div>
          <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            <span className="sr-only">Abhishek Kumar, Quality Engineer</span>
            <motion.span className="block" style={motionStyle({ x: line1 })}>
              <Letters text="Abhishek" ready={ready} delay={0.05} />
            </motion.span>
            <motion.span className="block text-mute md:pl-[12%]" style={motionStyle({ x: line2 })}>
              <Letters text="Kumar." ready={ready} delay={0.3} />
            </motion.span>
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-mute md:text-lg"
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.02, delayChildren: 0.6 } } }}
          >
            <span className="sr-only">Quality Engineer {lede}</span>
            {['Quality', 'Engineer', ...lede.split(' ')].map((w, i) => (
              <motion.span
                key={i}
                aria-hidden
                className={`mr-[0.26em] inline-block ${i < 2 ? 'text-fg' : ''}`}
                variants={{ hidden: { opacity: 0, y: '1em' }, show: { opacity: 1, y: '0em', transition: { duration: 0.9, ease } } }}
              >
                {w}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
          <motion.div {...show(0.7)} className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink">
                <Roll>See my work</Roll>
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={resume} download className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fg/5">
                <Roll>Résumé</Roll> <Download size={15} />
              </a>
            </Magnetic>
          </motion.div>

          <motion.div {...show(0.8)} className="min-w-[14rem]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Currently focused on</p>
            <p className="mt-1.5 text-lg font-medium tracking-tight md:text-xl">
              <span className="sr-only">{roles.join(', ')}</span>
              <RoleRotator />
            </p>
          </motion.div>

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1, ease, delay: 0.8 }}
          >
            <Badge reduce={reduce} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
