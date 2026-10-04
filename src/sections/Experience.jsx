import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { education, experience } from '../data'
import { SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

function Dot({ current }) {
  return (
    <motion.span
      aria-hidden
      className="absolute -left-[5px] top-1.5 grid h-[11px] w-[11px] place-items-center rounded-full border-2 border-bg bg-fg md:left-[calc(28%-5px)]"
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
    <section id="experience" className="shell py-24 md:py-32">
      <SectionHead index="03" kicker="Experience" title="Where I've shipped quality." highlight={['shipped', 'quality.']} />

      <div ref={ref} className="relative">
        <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line md:left-[28%]" />
        <motion.div
          aria-hidden
          className="absolute left-0 top-0 h-full w-px origin-top bg-fg md:left-[28%]"
          style={{ scaleY: reduce ? 1 : draw }}
        />

        <ol className="space-y-16 md:space-y-20">
          {experience.map((e) => (
            <li key={e.org} className="relative grid gap-5 pl-7 md:grid-cols-[28%_1fr] md:gap-0 md:pl-0">
              <Dot current={e.current} />
              <div className="md:sticky md:top-24 md:self-start md:pr-10 md:text-right">
                <motion.p
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease }}
                >
                  {e.period}
                </motion.p>
                <p className="mt-2 text-base font-semibold">{e.org}</p>
                <p className="mt-0.5 text-sm text-mute">{e.place}</p>
                {e.current && (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Current
                  </span>
                )}
              </div>

              <div className="md:pl-10">
                <motion.h3
                  className="text-xl font-semibold tracking-[-0.02em] md:text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease }}
                >
                  {e.role}
                </motion.h3>
                <Stagger as="ul" className="mt-5 divide-y divide-line border-y border-line" gap={0.06}>
                  {e.points.map((pt, i) => (
                    <StaggerItem as="li" key={pt} className="flex gap-4 py-3 text-[15px] leading-relaxed">
                      <span className="pt-0.5 font-mono text-[11px] text-mute">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-fg/85">{pt}</span>
                    </StaggerItem>
                  ))}
                </Stagger>
                <Stagger className="mt-5 flex flex-wrap gap-1.5" gap={0.04}>
                  {e.tags.map((t) => (
                    <StaggerItem
                      key={t}
                      variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 22 } } }}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-mute"
                    >
                      {t}
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </li>
          ))}

          <li className="relative grid gap-5 pl-7 md:grid-cols-[28%_1fr] md:gap-0 md:pl-0">
            <Dot />
            <div className="md:pr-10 md:text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{education.year}</p>
              <p className="mt-2 text-base font-semibold">Education</p>
            </div>
            <motion.div
              className="flex items-center gap-4 md:pl-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line">
                <GraduationCap size={18} strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{education.degree}</h3>
                <p className="text-sm text-mute">{education.school}</p>
              </div>
            </motion.div>
          </li>
        </ol>
      </div>
    </section>
  )
}
