import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { education, experience } from '../data'
import { SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

function Dot({ current }) {
  return (
    <motion.span
      aria-hidden
      className="absolute -left-[7px] top-1 grid h-[15px] w-[15px] place-items-center rounded-full border-2 border-bg bg-accent md:left-[calc(30%-7px)]"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: '-30% 0px' }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {current && <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />}
    </motion.span>
  )
}

/** Timeline whose spine draws itself as you scroll through it. */
export default function Experience() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <section id="experience" className="shell py-24 md:py-40">
      <SectionHead index="03" kicker="Experience" title="Where I've shipped quality." highlight={['quality']} />

      <div ref={ref} className="relative">
        <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line md:left-[30%]" />
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 h-full w-[2px] origin-top bg-accent md:left-[30%]"
          style={{ scaleY: reduce ? 1 : draw }}
        />

        <ol className="space-y-20 md:space-y-28">
          {experience.map((e) => (
            <li key={e.org} className="relative grid gap-6 pl-8 md:grid-cols-[30%_1fr] md:gap-0 md:pl-0">
              <Dot current={e.current} />
              <div className="md:sticky md:top-28 md:self-start md:pr-12 md:text-right">
                <motion.p
                  className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease }}
                >
                  {e.period}
                </motion.p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{e.org}</p>
                <p className="mt-1 text-sm text-mute">{e.place}</p>
                {e.current && (
                  <span className="mt-4 inline-block rounded-full bg-lime px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-on-lime">
                    Current
                  </span>
                )}
              </div>

              <div className="md:pl-12">
                <motion.h3
                  className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease }}
                >
                  {e.role}
                </motion.h3>
                <Stagger as="ul" className="mt-8 divide-y divide-line border-y border-line" gap={0.06}>
                  {e.points.map((pt, i) => (
                    <StaggerItem as="li" key={pt} className="flex gap-5 py-4 text-mute md:text-lg">
                      <span className="pt-1 font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-fg/85">{pt}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
                <Stagger className="mt-6 flex flex-wrap gap-2" gap={0.04}>
                  {e.tags.map((t) => (
                    <StaggerItem
                      key={t}
                      variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } } }}
                      className="rounded-full border border-line px-3 py-1.5 font-mono text-xs"
                    >
                      {t}
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </li>
          ))}

          <li className="relative grid gap-6 pl-8 md:grid-cols-[30%_1fr] md:gap-0 md:pl-0">
            <Dot />
            <div className="md:pr-12 md:text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{education.year}</p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight">Education</p>
            </div>
            <motion.div
              className="flex items-center gap-5 md:pl-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet text-on-violet">
                <GraduationCap size={24} />
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{education.degree}</h3>
                <p className="mt-1 text-mute">{education.school}</p>
              </div>
            </motion.div>
          </li>
        </ol>
      </div>
    </section>
  )
}
