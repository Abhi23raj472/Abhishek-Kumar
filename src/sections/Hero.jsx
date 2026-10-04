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
import { Magnetic, ease } from '../lib/motion'

const resume = `${import.meta.env.BASE_URL}${profile.resume}`

function Letters({ text, ready, delay = 0 }) {
  return (
    <span aria-hidden className="-mb-[0.1em] inline-flex overflow-hidden pb-[0.1em]">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block origin-bottom-left"
          initial={{ y: '115%', rotate: 10 }}
          animate={ready ? { y: '0%', rotate: 0 } : undefined}
          transition={{ duration: 1.1, ease, delay: delay + i * 0.04 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

function RoleRotator() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % roles.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <span aria-hidden className="relative block h-[1.2em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="absolute inset-x-0 top-0 whitespace-nowrap text-accent"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.65, ease }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Circular text badge: spins slowly, and faster as you scroll. */
function Badge({ reduce }) {
  const { scrollY } = useScroll()
  const time = useTime()
  const rotate = useTransform(() => (reduce ? 0 : time.get() / 90 + scrollY.get() * 0.2))
  const r = 78
  return (
    <a href="#about" aria-label="Scroll to about section" className="group relative grid h-32 w-32 shrink-0 place-items-center md:h-40 md:w-40">
      <motion.svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" style={{ rotate }} aria-hidden>
        <defs>
          <path id="badge-circle" d={`M100,100 m-${r},0 a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 -${r * 2},0`} />
        </defs>
        <text className="fill-fg font-mono text-[12px] uppercase">
          <textPath href="#badge-circle" textLength={2 * Math.PI * r - 6} lengthAdjust="spacing">
            Quality Engineer ✦ Tosca Automation ✦ 5+ Years ✦
          </textPath>
        </text>
      </motion.svg>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-lime text-on-lime transition-transform duration-500 group-hover:scale-110 md:h-16 md:w-16">
        <ArrowDown size={20} />
      </span>
    </a>
  )
}

export default function Hero({ ready }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Cursor-following glow behind the type.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const gx = useSpring(mx, { stiffness: 80, damping: 20 })
  const gy = useSpring(my, { stiffness: 80, damping: 20 })
  const glow = useMotionTemplate`radial-gradient(560px circle at ${gx}px ${gy}px, var(--glow), transparent 70%)`
  useEffect(() => {
    mx.set(window.innerWidth * 0.7)
    my.set(window.innerHeight * 0.45)
  }, [mx, my])
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }

  // Scrolling away pulls the two name lines apart and lifts the content.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const line1 = useTransform(p, [0, 1], ['0%', '-22%'])
  const line2 = useTransform(p, [0, 1], ['0%', '22%'])
  const lift = useTransform(p, [0, 1], ['0%', '30%'])
  const fade = useTransform(p, [0, 0.75], [1, 0])
  const motionStyle = (s) => (reduce ? undefined : s)

  const show = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease, delay },
  })

  return (
    <section ref={ref} id="top" onPointerMove={onMove} className="relative isolate flex min-h-svh flex-col overflow-hidden pb-8 pt-24 md:pb-10 md:pt-28">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: glow }} />

      <motion.div style={motionStyle({ y: lift, opacity: fade })} className="shell flex flex-1 flex-col justify-between gap-10">
        <motion.div {...show(0.1)} className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.18em] text-mute">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-2 text-fg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            Open to new roles
          </span>
          <span>{profile.company} · {profile.location}</span>
        </motion.div>

        <h1 className="font-display text-[21vw] md:text-[clamp(3.6rem,15.5vw,16rem)] font-semibold leading-[0.84] tracking-[-0.06em]">
          <span className="sr-only">Abhishek Kumar, Quality Engineer</span>
          <motion.span className="block" style={motionStyle({ x: line1 })}>
            <Letters text="Abhishek" ready={ready} delay={0.05} />
          </motion.span>
          <motion.span className="block text-right" style={motionStyle({ x: line2 })}>
            <Letters text="Kumar" ready={ready} delay={0.3} />
            <motion.span
              aria-hidden
              className="inline-block text-accent"
              initial={{ scale: 0 }}
              animate={ready ? { scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.85 }}
            >
              .
            </motion.span>
          </motion.span>
        </h1>

        <div className="grid items-end gap-8 md:grid-cols-12">
          <motion.div {...show(0.6)} className="md:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-mute">
              <span className="text-fg">Quality Engineer</span> building scalable test automation for web, desktop and API
              experiences — so teams release with speed and confidence.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#work" className="group inline-flex items-center gap-3 rounded-full bg-fg py-2 pl-6 pr-2 font-semibold text-bg">
                  See my work
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-on-lime transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={resume} download className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-[0.85rem] font-semibold transition-colors hover:bg-fg/5">
                  Résumé <Download size={16} />
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div {...show(0.75)} className="md:col-span-4 md:col-start-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-mute">Currently focused on</p>
            <p className="mt-2 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-tight tracking-tight">
              <span className="sr-only">{roles.join(', ')}</span>
              <RoleRotator />
            </p>
          </motion.div>

          <motion.div
            className="hidden justify-end md:col-span-2 md:flex"
            initial={{ opacity: 0, scale: 0.6, rotate: -60 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ duration: 1.2, ease, delay: 0.7 }}
          >
            <Badge reduce={reduce} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
