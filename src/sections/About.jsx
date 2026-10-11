import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { education, experience, intro, latest } from '../data'
import { Reveal, Section } from '../lib/motion'

/** A word a reviewer has marked: the highlighter runs across it as the paragraph scrolls by. */
function Marked({ word, progress, from, to }) {
  const scaleX = useTransform(progress, [from, to], [0, 1])
  return (
    <span className="relative inline-block whitespace-nowrap">
      <motion.span aria-hidden className="absolute inset-x-[-2px] bottom-[0.08em] top-[0.42em] -z-10 origin-left bg-stamp-wash" style={{ scaleX }} />
      <motion.span aria-hidden className="absolute inset-x-[-2px] bottom-[0.02em] h-[2px] origin-left bg-stamp" style={{ scaleX }} />
      <span className="font-semibold">{word}</span>
    </span>
  )
}

function MarkedParagraph({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] })
  const words = text.split(' ')
  const marked = words.filter((w) => w.startsWith('*')).length
  let k = 0
  return (
    <p ref={ref} className="relative isolate max-w-[60ch] text-[clamp(1.15rem,1.9vw,1.45rem)] leading-[1.6]">
      {words.map((w, i) => {
        const space = i < words.length - 1 ? ' ' : ''
        if (!w.startsWith('*')) return w + space
        const n = k++
        return (
          <span key={i}>
            <Marked word={w.replace(/\*/g, '')} progress={scrollYProgress} from={n / marked} to={(n + 1) / marked} />
            {space}
          </span>
        )
      })}
    </p>
  )
}

export default function About() {
  const now = experience.find((e) => e.current)
  const notes = [
    ['Currently', `${now.role}, ${now.org}`, `${now.place} · ${now.period}`],
    ['Latest course', latest[0].name, `${latest[0].note} · ${latest[0].date}`],
    ['Education', education.degree.replace(' — ', ', '), `${education.school} · ${education.year}`],
  ]
  return (
    <Section id="about" no="1.0" label="Summary" title="Test automation that holds up after the release.">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
        <MarkedParagraph text={intro} />
        <dl className="border-t border-ink">
          {notes.map(([k, v, sub], i) => (
            <Reveal key={k} delay={i * 0.08} className="border-b border-rule py-4">
              <dt className="label">{k}</dt>
              <dd className="mt-1.5 font-semibold leading-snug">{v}</dd>
              <dd className="mt-1 text-[14px] text-ink-2">{sub}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  )
}
