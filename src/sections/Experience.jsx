import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experience } from '../data'
import { SectionHead, Spotlight, ease } from '../components/motion'

export default function Experience() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })

  return (
    <section id="experience" className="overflow-x-clip mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead
        index="03"
        kicker="Experience"
        title={<>Owning automation <span className="text-gradient">end to end</span>.</>}
        sub="Delivery across two global enterprises — from framework architecture to daily regression reports."
      />

      <div ref={ref} className="relative pl-8 md:pl-12">
        <div className="absolute bottom-0 left-[7px] top-2 w-px bg-line md:left-[11px]" />
        <motion.div
          style={{ scaleY: line }}
          className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-pass via-cyan to-pass md:left-[11px]"
        />

        <div className="space-y-8">
          {experience.map((job) => (
            <motion.article
              key={job.org}
              initial={{ opacity: 0, x: 60, rotateY: -18, transformPerspective: 1200 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0, transformPerspective: 1200 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease }}
              className="relative"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                className={`absolute -left-8 top-8 grid h-4 w-4 place-items-center rounded-full border-2 md:-left-12 md:h-6 md:w-6 ${job.current ? 'border-pass bg-pass/20' : 'border-line-2 bg-ink'}`}
              >
                {job.current && <span className="h-1.5 w-1.5 animate-ping rounded-full bg-pass md:h-2 md:w-2" />}
              </motion.span>

              <Spotlight tilt={3} className="p-7 md:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-fg md:text-3xl">{job.role}</h3>
                    <p className="mt-1 text-fg/80">
                      {job.org} <span className="text-mute">· {job.place}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.current && (
                      <span className="rounded-full bg-pass/15 px-2.5 py-1 font-mono text-[11px] text-pass">current</span>
                    )}
                    <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-dim">{job.period}</span>
                  </div>
                </div>

                <ul className="mt-6 grid gap-x-8 gap-y-3 md:grid-cols-2">
                  {job.points.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.25 + i * 0.05 }}
                      className="flex gap-3 leading-relaxed"
                    >
                      <span className="mt-[3px] font-mono text-sm text-pass">✓</span>
                      <span>{p}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-1.5 border-t border-white/10 pt-5">
                  {job.tags.map((t) => (
                    <span key={t} className="glass-chip rounded-md px-2 py-1 font-mono text-xs text-dim">{t}</span>
                  ))}
                </div>
              </Spotlight>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
