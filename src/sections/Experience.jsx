import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experience } from '../data'
import { Reveal, Section, Stagger, StaggerItem } from '../lib/motion'

/** One role, written up like an entry in a revision history. */
function Role({ r, rev }) {
  return (
    <article className="relative pb-14 pl-8 last:pb-0 md:pl-10">
      {/* node on the timeline */}
      <span
        aria-hidden
        className={`absolute left-[-6px] top-1 h-[13px] w-[13px] border-2 ${r.current ? 'border-stamp bg-stamp' : 'border-ink bg-sheet'}`}
      />
      <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="figure font-mono text-[13px] font-medium">{r.period}</p>
        <p className="label">Rev {rev}</p>
        {r.current && <p className="bg-stamp px-2 py-0.5 font-mono text-[11px] font-semibold tracking-[0.12em] text-on-ink">CURRENT</p>}
      </Reveal>
      <div className="mt-4 min-w-0">
        <Reveal>
          <h3 className="display text-[clamp(1.5rem,2.8vw,2.1rem)]">{r.role}</h3>
          <p className="mt-2 text-[16px] font-semibold">
            {r.org} <span className="font-normal text-ink-2">· {r.place}</span>
          </p>
        </Reveal>
        <Stagger as="ul" gap={0.05} className="mt-6 max-w-[68ch] space-y-3">
          {r.points.map((p) => (
            <StaggerItem as="li" key={p} className="grid grid-cols-[14px_minmax(0,1fr)] gap-3 text-[15.5px] leading-relaxed">
              <span aria-hidden className="mt-[0.6em] h-[6px] w-[6px] bg-ink" />
              <span>{p}</span>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-6 flex flex-wrap gap-2">
          {r.tags.map((t) => (
            <span key={t} className="border border-rule px-2 py-1 font-mono text-[12px] text-ink-2">
              {t}
            </span>
          ))}
        </Reveal>
      </div>
    </article>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <Section
      id="experience"
      no="4.0"
      label="Record"
      title="Where the work happened."
      intro="Two enterprises, five years, one thread: Tosca automation that scales."
    >
      <div ref={ref} className="relative">
        {/* the timeline fills in ink as you read down it */}
        <div aria-hidden className="absolute bottom-0 left-0 top-2 w-px bg-rule">
          <motion.div className="h-full w-full origin-top bg-stamp" style={{ scaleY: fill }} />
        </div>
        {experience.map((r, i) => (
          <Role key={r.org} r={r} rev={String.fromCharCode(65 + experience.length - 1 - i)} />
        ))}
      </div>
    </Section>
  )
}
