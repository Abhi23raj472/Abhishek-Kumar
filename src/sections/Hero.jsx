import { Component, Suspense, lazy, useEffect, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { marquee, profile, specChecks, stats } from '../data'
import { Counter, Depth, Magnetic, Spotlight, ease } from '../components/motion'

const GlassScene = lazy(() => import('../components/GlassScene'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

// If WebGL fails for any reason, drop the 3D scene and keep the page.
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

const headline = ['I', 'build', 'test', 'automation', 'that', 'ships', 'with', 'confidence.']

function Terminal() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(reduce ? specChecks.length : 0)
  useEffect(() => {
    if (reduce) return
    if (done >= specChecks.length) return
    const t = setTimeout(() => setDone((d) => d + 1), done === 0 ? 1100 : 420)
    return () => clearTimeout(t)
  }, [done, reduce])
  const finished = done >= specChecks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease, delay: 0.5 }}
      style={{ transformPerspective: 1200 }}
      className="relative w-full"
    >
     <Spotlight tilt={9} className="scope-dark glass-blur overflow-hidden">
      <div className="flex items-center gap-2 border-b border-tint/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-mute">profile.spec</span>
        <span className={`ml-auto flex items-center gap-1.5 font-mono text-[11px] ${finished ? 'text-pass' : 'text-cyan'}`}>
          <motion.span
            className={`h-1.5 w-1.5 rounded-full ${finished ? 'bg-pass' : 'bg-cyan'}`}
            animate={finished ? { opacity: 1 } : { opacity: [1, 0.2, 1] }}
            transition={{ repeat: finished ? 0 : Infinity, duration: 1 }}
          />
          {finished ? 'passed' : 'running'}
        </span>
      </div>
      <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
        <div className="text-dim">
          <span className="text-pass">$</span> tosca run --suite profile
        </div>
        {specChecks.map((c, i) => (
          <motion.div
            key={c.t}
            initial={false}
            animate={i < done ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3"
          >
            <span className="w-4 text-center">
              {i < done ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block text-pass">✓</motion.span>
              ) : i === done ? (
                <motion.span className="inline-block text-cyan" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}>◌</motion.span>
              ) : (
                <span className="text-mute">·</span>
              )}
            </span>
            <span className={i < done ? 'text-fg' : 'text-mute'}>{c.t}</span>
            <span className="ml-auto text-mute">{i < done ? `${c.ms}ms` : ''}</span>
          </motion.div>
        ))}
        <motion.div
          initial={false}
          animate={{ opacity: finished ? 1 : 0, y: finished ? 0 : 6 }}
          className="mt-3 border-t border-tint/10 pt-3 text-dim"
        >
          <span className="text-pass">6 passed</span>, 0 failed · <span className="text-fg">open to new roles</span>
        </motion.div>
      </div>
     </Spotlight>
    </motion.div>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const row = [...marquee, ...marquee]
  return (
    <div className="relative mt-16 overflow-hidden border-y border-tint/10 bg-tint/[0.02] py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div
        className="flex w-max gap-10 pr-10"
        animate={reduce ? {} : { x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 38 }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap font-display text-lg text-dim">
            <span className="text-pass">✓</span>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const [webgl] = useState(() => hasWebGL())
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)
  const glow = useMotionTemplate`radial-gradient(600px circle at ${mx}px ${my}px, rgba(16,185,129,0.10), transparent 70%)`
  const { scrollY } = useScroll()
  const yText = useTransform(scrollY, [0, 600], [0, -60])
  const fade = useTransform(scrollY, [0, 500], [1, 0.3])

  return (
    <section
      id="top"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      className="relative overflow-hidden pt-32 md:pt-40"
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.15fr_1fr]">
        <motion.div style={{ y: yText, opacity: fade }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="glass-chip inline-flex items-center gap-2 rounded-full py-1 pl-2 pr-3 font-mono text-xs font-medium text-pass"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pass opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pass" />
            </span>
            Available for new roles · {profile.location}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 font-mono text-sm text-mute"
          >
            {profile.name} — {profile.role} @ {profile.company}
          </motion.p>

          <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-[4.4rem]">
            {headline.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className={`inline-block ${w.startsWith('confidence') ? 'text-gradient' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.35 + i * 0.06 }}
                >
                  {w}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.9 }}
            className="mt-6 max-w-xl text-lg leading-relaxed"
          >
            Five years engineering scalable suites in <b className="text-fg">Tricentis Tosca</b> — validating APIs,
            wiring CI/CD quality gates and cutting regression cycles for global enterprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 1.05 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-2xl bg-pass px-6 py-3.5 font-semibold text-onaccent shadow-[0_12px_30px_-10px_rgba(5,150,105,0.55)]"
              >
                Get in touch
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#experience"
                className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-fg transition-colors hover:bg-tint/10"
              >
                View experience
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <div className="relative h-[430px] sm:h-[500px] lg:h-[580px]">
          {webgl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease, delay: 0.2 }}
              className="absolute -inset-x-10 -top-16 bottom-24 lg:-inset-x-16 lg:-top-24"
            >
              <SceneBoundary>
                <Suspense fallback={null}>
                  <GlassScene reduce={!!reduce} />
                </Suspense>
              </SceneBoundary>
            </motion.div>
          )}
          <div className="absolute inset-x-0 bottom-0 lg:left-8">
            <Terminal />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4 md:px-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 30, rotateX: 30, transformPerspective: 900 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 900 }}
            transition={{ duration: 0.8, ease, delay: 1.1 + i * 0.08 }}
          >
            <Spotlight tilt={14} className="rounded-2xl p-5">
              <Depth z={28}>
                <div className="font-display text-4xl font-semibold text-fg">
                  <Counter to={s.v} suffix={s.suffix} />
                </div>
                <div className="mt-1 font-mono text-xs text-mute">{s.k}</div>
              </Depth>
            </Spotlight>
          </motion.div>
        ))}
      </div>

      <Marquee />
    </section>
  )
}
