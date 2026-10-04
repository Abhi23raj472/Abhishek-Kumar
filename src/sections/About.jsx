import { motion } from 'framer-motion'
import { intro, stats } from '../data'
import { Counter, Reveal, ScrollText, ease } from '../lib/motion'

export default function About() {
  return (
    <section id="about" className="shell py-24 md:py-40">
      <Reveal className="mb-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute">
        <span className="text-accent">(01)</span> About
      </Reveal>

      <ScrollText
        text={intro}
        className="max-w-6xl font-display text-[clamp(1.75rem,4.2vw,4rem)] font-medium leading-[1.12] tracking-[-0.03em]"
      />

      <dl className="mt-20 grid grid-cols-2 md:mt-32 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.k} className="relative pr-4 pt-6 md:pt-8">
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left bg-line"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: i * 0.12 }}
            />
            <dd className="font-display text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-none tracking-[-0.05em]">
              <Counter to={s.v} />
              <span className="text-accent">{s.suffix}</span>
            </dd>
            <dt className="mt-3 max-w-[12rem] pb-8 text-sm text-mute">{s.k}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
