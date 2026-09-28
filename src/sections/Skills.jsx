import { motion } from 'framer-motion'
import { competencies, proficiency, stack } from '../data'
import { SectionHead, Spotlight, Stagger, StaggerItem, ease } from '../components/motion'

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead
        index="02"
        kicker="Skills"
        title={<>The toolkit behind <span className="text-gradient">every release</span>.</>}
        sub="The technologies and practices I use every day to ship quality at speed."
      />

      <Stagger className="grid gap-4 md:grid-cols-5">
        <StaggerItem className="md:col-span-3">
          <Spotlight tilt={3} className="h-full p-7 md:p-8">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
              <span>Proficiency</span>
              <span className="normal-case tracking-normal">self-assessed</span>
            </div>
            <div className="mt-7 space-y-6">
              {proficiency.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-fg">{p.name}</span>
                    <span className="font-mono text-xs text-pass">{p.level}</span>
                  </div>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-tint/[0.06]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-pass to-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease, delay: 0.15 + i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Spotlight>
        </StaggerItem>

        <StaggerItem className="md:col-span-2">
          <Spotlight tilt={3} className="h-full p-7 md:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Daily drivers</div>
            <div className="mt-6 space-y-5">
              {stack.map((s) => (
                <div key={s.k}>
                  <div className="font-mono text-xs text-mute">{s.k}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.v.map((v) => (
                      <motion.span
                        key={v}
                        whileHover={{ y: -2, borderColor: 'rgba(5,150,105,0.5)', color: '#0b1220' }}
                        className="cursor-default rounded-lg glass-chip px-2.5 py-1 text-sm"
                      >
                        {v}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Spotlight>
        </StaggerItem>

        <StaggerItem className="md:col-span-5">
          <Spotlight tilt={3} className="p-7 md:p-8">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
              <span>Core competencies</span>
              <span className="text-pass">{String(competencies.length).padStart(2, '0')}</span>
            </div>
            <Stagger className="mt-6 flex flex-wrap gap-2" gap={0.04}>
              {competencies.map((c) => (
                <StaggerItem key={c}>
                  <span className="inline-flex items-center gap-2 rounded-full glass-chip px-4 py-2 text-fg">
                    <span className="h-1.5 w-1.5 rounded-full bg-pass" />
                    {c}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </Spotlight>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
