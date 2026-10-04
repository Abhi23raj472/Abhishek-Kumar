import { motion } from 'framer-motion'
import { competencies, proficiency, stack } from '../data'
import { Counter, Reveal, SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

const pop = {
  hidden: { opacity: 0, y: 12, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 22 } },
}

export default function Skills() {
  return (
    <section id="skills" className="shell py-24 md:py-40">
      <SectionHead index="05" kicker="Skills" title="The toolkit behind the work." highlight={['toolkit']} />

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Proficiency bars fill as they scroll in. */}
        <div>
          <Reveal className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Proficiency</Reveal>
          <ul className="mt-6 space-y-7">
            {proficiency.map((p, i) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-xl font-medium tracking-tight md:text-2xl">{p.name}</span>
                  <span className="font-mono text-sm text-mute">
                    <Counter to={p.pct} suffix="%" />
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-fg/8" role="presentation">
                  <motion.div
                    className="h-full origin-left rounded-full bg-accent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: p.pct / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease, delay: 0.1 + i * 0.1 }}
                  />
                </div>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-wider text-mute">{p.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-12">
          <div>
            <Reveal className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Stack</Reveal>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {stack.map((g) => (
                <div key={g.k} className="grid gap-3 py-5 sm:grid-cols-[7rem_1fr] sm:items-center">
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{g.k}</dt>
                  <Stagger as="dd" className="flex flex-wrap gap-2" gap={0.05}>
                    {g.v.map((t) => (
                      <StaggerItem
                        key={t}
                        variants={pop}
                        whileHover={{ y: -3 }}
                        className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-accent"
                      >
                        {t}
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              ))}
            </dl>
          </div>

          {/* Competencies read like a passing test report. */}
          <div className="rounded-[1.5rem] border border-line bg-[#111214] p-6 font-mono text-sm text-[#eceef1] md:p-8">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] opacity-60">
              <span>competencies.spec</span>
              <span>{competencies.length} passed</span>
            </div>
            <Stagger as="ul" className="mt-5 space-y-2" gap={0.07}>
              {competencies.map((c) => (
                <StaggerItem
                  as="li"
                  key={c}
                  variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lime">✓</span>
                  <span className="flex-1">{c}</span>
                  <span aria-hidden className="hidden h-px flex-1 border-t border-dashed border-white/20 sm:block" />
                  <span className="text-xs text-lime">PASS</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
