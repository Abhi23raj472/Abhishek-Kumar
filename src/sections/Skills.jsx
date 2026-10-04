import { motion } from 'framer-motion'
import { competencies, proficiency, stack } from '../data'
import { Counter, Reveal, SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

const pop = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 380, damping: 24 } },
}

const label = 'font-mono text-[11px] uppercase tracking-[0.18em] text-mute'

export default function Skills() {
  return (
    <section id="skills" className="shell py-24 md:py-32">
      <SectionHead index="05" kicker="Skills" title="The toolkit behind the work." highlight={['behind', 'the', 'work.']} />

      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Proficiency bars fill as they scroll in. */}
        <div>
          <Reveal className={label}>Proficiency</Reveal>
          <ul className="mt-6 space-y-6">
            {proficiency.map((p, i) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[15px] font-medium">{p.name}</span>
                  <span className="font-mono text-xs text-mute">
                    <span className="mr-3 uppercase tracking-wider">{p.level}</span>
                    <Counter to={p.pct} suffix="%" />
                  </span>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-fg/[0.07]" role="presentation">
                  <motion.div
                    className="h-full origin-left rounded-full bg-fg"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: p.pct / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease, delay: 0.1 + i * 0.1 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-10">
          <div>
            <Reveal className={label}>Stack</Reveal>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {stack.map((g) => (
                <div key={g.k} className="grid gap-2.5 py-4 sm:grid-cols-[6.5rem_1fr] sm:items-center">
                  <dt className={label}>{g.k}</dt>
                  <Stagger as="dd" className="flex flex-wrap gap-1.5" gap={0.05}>
                    {g.v.map((t) => (
                      <StaggerItem
                        key={t}
                        variants={pop}
                        className="rounded-full border border-line px-3 py-1 text-[13px] transition-colors hover:border-fg/40"
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
          <div className="rounded-2xl border border-line bg-surface p-6 font-mono text-[13px]">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-mute">
              <span>competencies.spec</span>
              <span>{competencies.length} passed</span>
            </div>
            <Stagger as="ul" className="mt-4 space-y-1.5" gap={0.06}>
              {competencies.map((c) => (
                <StaggerItem
                  as="li"
                  key={c}
                  variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
                  className="flex items-center gap-3"
                >
                  <span className="text-accent">✓</span>
                  <span>{c}</span>
                  <span aria-hidden className="hidden h-px flex-1 border-t border-dashed border-line sm:block" />
                  <span className="ml-auto text-[11px] text-mute">pass</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
