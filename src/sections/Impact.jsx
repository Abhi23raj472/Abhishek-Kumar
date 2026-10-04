import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { impact } from '../data'
import { SectionHead } from '../lib/motion'

// Alternate light and dark cards so each layer of the stack is distinct.
const tones = [
  'bg-surface text-fg border border-line',
  'bg-ink text-on-ink',
  'bg-surface-2 text-fg border border-line',
]

/** Card that pins near the top and shrinks back as later cards stack over it. */
function StackCard({ it, i, n, progress, reduce }) {
  const start = i / n
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - 1 - i) * 0.03])
  return (
    <div className="sticky" style={{ top: `calc(88px + ${i * 18}px)` }}>
      <motion.article
        style={reduce ? undefined : { scale }}
        className={`mb-[12vh] flex min-h-[200px] origin-top flex-col justify-between gap-8 rounded-2xl p-7 shadow-[0_-10px_30px_-20px_rgb(0_0_0/0.35)] md:min-h-[220px] md:flex-row md:items-end md:p-10 ${tones[i % tones.length]}`}
      >
        <div className="flex items-start justify-between gap-6 md:flex-col md:self-stretch">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-60">{it.code}</span>
          <span className="text-[clamp(2.5rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.05em] opacity-90">0{i + 1}</span>
        </div>
        <div className="max-w-lg">
          <h3 className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">{it.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed opacity-70">{it.body}</p>
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
    <section id="impact" className="shell py-24 md:py-32">
      <SectionHead
        index="04"
        kicker="Impact"
        title="Results that show up in every release."
        highlight={['in', 'every', 'release.']}
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
