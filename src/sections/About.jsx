import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { profile, record, stats } from '../data'
import { Counter, Roll, SectionHead, ease } from '../lib/motion'

const resume = `${import.meta.env.BASE_URL}${profile.resume}`

/** Types its text out once it scrolls into view. */
function TypeOut({ text, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(text.length)
      return
    }
    let id
    const start = setTimeout(() => {
      id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), 22)
    }, delay * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(id)
    }
  }, [inView, reduce, text, delay])
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.slice(0, n)}
        {inView && n < text.length && <span className="ml-px inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-accent/70" />}
      </span>
    </span>
  )
}

/** A porthole onto a radar scope: rings, a turning sweep and a few blips. */
function Porthole() {
  const blips = [
    [28, 34, 0],
    [66, 26, 1.2],
    [72, 64, 2.1],
    [38, 70, 3.3],
  ]
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <motion.svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <motion.circle
          cx="50" cy="50" r="49"
          fill="none" stroke="var(--accent)" strokeWidth="0.4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease }}
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={50 + Math.cos((i * Math.PI) / 6) * 46.5}
            cy={50 + Math.sin((i * Math.PI) / 6) * 46.5}
            r="0.8"
            fill="var(--mute)"
            opacity="0.5"
          />
        ))}
      </motion.svg>
      <div className="absolute inset-[6%] rounded-full border border-line bg-[#060a14] p-[5%] shadow-[inset_0_0_40px_rgb(0_0_0/0.8),0_0_60px_rgb(77_141_255/0.08)]">
        <div className="relative h-full w-full overflow-hidden rounded-full bg-[radial-gradient(circle,#0b1a33,#050913_70%)]">
          {[22, 38, 50].map((r) => (
            <span key={r} aria-hidden className="absolute rounded-full border border-accent/15" style={{ inset: `${50 - r}%` }} />
          ))}
          <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-accent/10" />
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-accent/10" />
          <span aria-hidden className="sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgb(143_196_255/0.28),transparent_22%)]" />
          {blips.map(([x, y, d]) => (
            <motion.span
              key={`${x}-${y}`}
              aria-hidden
              className="absolute h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ opacity: [0.15, 1, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, delay: d, ease: 'easeInOut' }}
            />
          ))}
          <span className="absolute inset-0 grid place-items-center font-display text-6xl italic text-fg">AK</span>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="shell py-24 md:py-36">
      <div className="grid items-start gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease }}
          className="md:sticky md:top-28"
        >
          <Porthole />
        </motion.div>

        <div className="min-w-0">
          <SectionHead index="01" kicker="About" title="A systems mindset for better releases." highlight={['better', 'releases.']} className="mb-8!" />

          <div className="panel rounded-2xl p-5 font-mono text-[13px] md:p-6">
            <p className="label mb-4">Crew record</p>
            <dl className="space-y-2.5">
              {record.map(([k, v], i) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 sm:grid-cols-[9rem_1fr]">
                  <dt className="text-mute">{k}</dt>
                  <dd className={k === 'Status' ? 'text-signal' : 'text-fg'}>
                    <TypeOut text={v} delay={0.15 + i * 0.25} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 max-w-xl leading-relaxed text-mute">
            I work where test strategy, automation and delivery meet. From reusable modules and data-driven design to
            parallel execution and defect triage, I build quality into the way teams ship.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {[
              ['Email', `mailto:${profile.email}`],
              ['LinkedIn', profile.linkedin],
              ['GitHub', profile.github],
              ['Résumé', resume],
            ].map(([k, href]) => (
              <a
                key={k}
                href={href}
                {...(k === 'Résumé' ? { download: true } : href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="rounded-full border border-line px-4 py-2 transition-colors hover:border-accent"
              >
                <Roll>{k}</Roll>
              </a>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.k} className="bg-bg/80 p-4">
                <dd className="font-display text-4xl">
                  <Counter to={s.v} />
                  <span className="text-accent">{s.suffix}</span>
                </dd>
                <dt className="mt-1 text-xs leading-snug text-mute">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
