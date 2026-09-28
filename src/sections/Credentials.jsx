import { motion } from 'framer-motion'
import { awards, certs, education } from '../data'
import { SectionHead, Spotlight, Stagger, StaggerItem, ease } from '../components/motion'

const certCount = certs.reduce((a, c) => a + c.items.length, 0)

export default function Credentials() {
  return (
    <section id="credentials" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead
        index="06"
        kicker="Credentials"
        title={<>Certified, and <span className="text-gradient">recognized</span>.</>}
        sub="Formal training, enterprise awards and academic background."
      />

      <Stagger className="grid gap-4 lg:grid-cols-2">
        <StaggerItem className="flex flex-col gap-4">
          <Spotlight tilt={3} className="p-7 md:p-8">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
              <span>Certifications</span>
              <span className="text-pass">{certCount} total</span>
            </div>
            <div className="mt-6 space-y-5">
              {certs.map((c) => (
                <div key={c.org}>
                  <div className="text-sm font-semibold text-fg">{c.org}</div>
                  <Stagger className="mt-2 flex flex-wrap gap-1.5" gap={0.03}>
                    {c.items.map((it) => (
                      <StaggerItem key={it}>
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-pass/20 bg-pass/[0.07] px-2.5 py-1 font-mono text-xs text-fg">
                          <span className="text-pass">✓</span>
                          {it}
                        </span>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </div>
              ))}
            </div>
          </Spotlight>

          <Spotlight tilt={3} className="p-7 md:p-8">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
              <span>Education</span>
              <span className="text-pass">{education.year}</span>
            </div>
            <div className="mt-4 font-display text-xl font-semibold text-fg">{education.degree}</div>
            <div className="mt-1">{education.school}</div>
          </Spotlight>
        </StaggerItem>

        <StaggerItem>
          <Spotlight tilt={3} className="h-full p-7 md:p-8">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-mute">
              <span>Awards</span>
              <span className="text-pass">{String(awards.length).padStart(2, '0')}</span>
            </div>
            <ol className="mt-6 space-y-2">
              {awards.map((a, i) => (
                <motion.li
                  key={a.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.08 }}
                  whileHover={{ x: 4 }}
                  className={`rounded-2xl border p-5 ${i === 0 ? 'border-pass/30 bg-gradient-to-br from-pass/10 to-cyan/5' : 'border-line bg-white/[0.02]'}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-lg font-semibold text-fg">
                      {i === 0 && <span className="mr-2">🏆</span>}
                      {a.name}
                    </span>
                    <span className="font-mono text-xs text-mute">{a.date}</span>
                  </div>
                  {a.by && <div className="mt-0.5 text-sm text-pass">{a.by}</div>}
                  <p className="mt-2 text-sm leading-relaxed">{a.body}</p>
                </motion.li>
              ))}
            </ol>
          </Spotlight>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
