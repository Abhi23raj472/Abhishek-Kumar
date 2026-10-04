import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { impact } from '../data'
import { SectionHead } from '../lib/motion'

const tones = [
  'bg-surface text-fg border border-line',
  'bg-fg text-bg',
  'bg-lime text-on-lime',
  'bg-surface-2 text-fg border border-line',
  'bg-violet text-on-violet',
  'bg-fg text-bg',
]

/** Card that pins near the top and shrinks back as later cards stack over it. */
function StackCard({ it, i, n, progress, reduce }) {
  const start = i / n
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - 1 - i) * 0.035])
  const tilt = useTransform(progress, [start, start + 1 / n], [0, i === n - 1 ? 0 : i % 2 ? 1.2 : -1.2])
  return (
    <div className="sticky" style={{ top: `calc(96px + ${i * 22}px)` }}>
      <motion.article
        style={reduce ? undefined : { scale, rotate: tilt }}
        className={`mb-[14vh] flex min-h-[300px] origin-top flex-col justify-between gap-10 rounded-[2rem] p-7 shadow-[0_-12px_40px_-24px_rgb(0_0_0/0.45)] md:min-h-[340px] md:flex-row md:items-end md:p-12 ${tones[i % tones.length]}`}
      >
        <div className="flex items-start justify-between gap-6 md:flex-col md:justify-between md:self-stretch">
          <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">{it.code}</span>
          <span className="font-display text-[clamp(4.5rem,10vw,9rem)] font-bold leading-[0.8] tracking-[-0.06em]">
            0{i + 1}
          </span>
        </div>
        <div className="max-w-xl">
          <h3 className="font-display text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{it.title}</h3>
          <p className="mt-4 text-lg leading-relaxed opacity-80">{it.body}</p>
        </div>
      </motion.article>
    </div>
  )
}

export default function Impact() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section id="impact" className="shell py-24 md:py-40">
      <SectionHead
        index="04"
        kicker="Impact"
        title="Results that show up in every release."
        highlight={['Results']}
        sub="Outcomes from the suites, frameworks and pipelines I've built and run."
      />
      <div ref={ref} className="relative">
        {impact.map((it, i) => (
          <StackCard key={it.code} it={it} i={i} n={impact.length} progress={scrollYProgress} reduce={reduce} />
        ))}
      </div>
    </section>
  )
}
