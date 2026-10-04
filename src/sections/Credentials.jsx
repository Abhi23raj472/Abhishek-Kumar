import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Plus, Trophy } from 'lucide-react'
import { awards, certs } from '../data'
import { SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

/** One award per row; hovering (or tapping) opens it up. */
function AwardRow({ a, i, open, onOpen }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease, delay: i * 0.08 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen(i)}
      className="relative isolate border-b border-line"
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom bg-lime"
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      />
      <button
        type="button"
        onClick={() => onOpen(open ? null : i)}
        aria-expanded={open}
        className={`grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-2 py-6 text-left transition-colors duration-300 md:grid-cols-[8rem_1fr_auto] md:px-4 md:py-8 ${
          open ? 'text-on-lime' : ''
        }`}
      >
        <span className="font-mono text-xs uppercase tracking-wider opacity-70">{a.date}</span>
        <span className="font-display text-[clamp(1.6rem,3.6vw,3.25rem)] font-semibold leading-none tracking-[-0.04em]">
          {a.name}
          {i === 0 && <Trophy className="ml-3 inline-block align-middle" size={26} strokeWidth={1.5} />}
        </span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }}>
          <Plus size={24} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden text-on-lime"
          >
            <p className="max-w-2xl px-2 pb-8 text-lg md:pl-[calc(8rem+2rem)] md:pr-4">
              {a.body}
              {a.by && <span className="mt-2 block font-mono text-xs uppercase tracking-wider opacity-70">Awarded by {a.by}</span>}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function Credentials() {
  const [open, setOpen] = useState(0)
  return (
    <section id="credentials" className="shell py-24 md:py-40">
      <SectionHead index="07" kicker="Recognition" title="The work gets noticed." highlight={['noticed.']} />

      <ul className="border-t border-line" onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(null)}>
        {awards.map((a, i) => (
          <AwardRow key={a.name} a={a} i={i} open={open === i} onOpen={setOpen} />
        ))}
      </ul>

      <div className="mt-24 md:mt-32">
        <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute">
          <BadgeCheck size={16} className="text-accent" /> Certifications
        </h3>
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {certs.map((c) => (
            <StaggerItem
              key={c.org}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col rounded-[1.5rem] border border-line bg-surface p-6"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl font-semibold tracking-tight">{c.org}</span>
                <span className="font-mono text-xs text-mute">×{c.items.length}</span>
              </div>
              <Stagger className="mt-6 flex flex-wrap gap-2" gap={0.05} delay={0.2}>
                {c.items.map((it) => (
                  <StaggerItem
                    key={it}
                    variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 18 } } }}
                    className="rounded-full bg-fg/[0.06] px-3 py-1.5 text-sm"
                  >
                    {it}
                  </StaggerItem>
                ))}
              </Stagger>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
