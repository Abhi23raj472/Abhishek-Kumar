import { motion } from 'framer-motion'
import { intro, stats } from '../data'
import { Counter, Reveal, ScrollText, ease } from '../lib/motion'

export default function About() {
  return (
    <section id="about" className="shell py-24 md:py-32">
      <Reveal className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
        <span className="text-accent">01</span> About
      </Reveal>

      <ScrollText
        text={intro}
        className="max-w-4xl text-[clamp(1.375rem,2.5vw,2.125rem)] font-medium leading-[1.35] tracking-[-0.02em]"
      />

      <dl className="mt-16 grid grid-cols-2 md:mt-24 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.k} className="relative pr-4 pt-6">
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left bg-line"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: i * 0.12 }}
            />
            <dd className="text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.04em]">
              <Counter to={s.v} />
              <span className="text-mute">{s.suffix}</span>
            </dd>
            <dt className="mt-2 max-w-[12rem] pb-6 text-sm text-mute">{s.k}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
