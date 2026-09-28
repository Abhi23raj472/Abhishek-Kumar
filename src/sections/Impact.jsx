import { motion } from 'framer-motion'
import { impact } from '../data'
import { SectionHead, Spotlight, Stagger, item } from '../components/motion'

export default function Impact() {
  return (
    <section id="impact" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead
        index="04"
        kicker="Impact"
        title={<>Results that <span className="text-gradient">moved the needle</span>.</>}
        sub="Highlights from enterprise automation delivery and QA transformation."
      />
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.07}>
        {impact.map((c) => (
          <motion.div key={c.code} variants={item}>
            <Spotlight
              className="group h-full overflow-hidden p-7"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-mute">{c.code}</span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.4 }}
                  className="rounded-full bg-pass/15 px-2.5 py-1 text-pass"
                >
                  ✓ PASS
                </motion.span>
              </div>
              <h3 className="mt-8 font-display text-xl font-semibold text-fg">{c.title}</h3>
              <p className="mt-2 leading-relaxed">{c.body}</p>
              <div className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-pass to-cyan transition-transform duration-500 group-hover:scale-x-100" />
            </Spotlight>
          </motion.div>
        ))}
      </Stagger>
    </section>
  )
}
