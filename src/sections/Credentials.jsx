import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Plus } from 'lucide-react'
import { awards, certs } from '../data'
import { SectionHead, Stagger, StaggerItem, ease } from '../lib/motion'

/** One award per row; hovering (or tapping) opens it up. */
function AwardRow({ a, i, open, onOpen }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease, delay: i * 0.08 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen(i)}
      className="relative isolate border-b border-line"
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 -z-10 origin-bottom bg-surface-2"
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      />
      <button
        type="button"
        onClick={() => onOpen(open ? null : i)}
        aria-expanded={open}
        className="grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-2 py-5 text-left md:grid-cols-[7rem_1fr_auto] md:px-4"
      >
        <span className="font-mono text-[11px] uppercase tracking-wider text-mute">{a.date}</span>
        <span className="font-display text-xl md:text-2xl">
          {a.name}
          {a.by && <span className="ml-2 hidden text-sm font-normal text-mute sm:inline">· {a.by}</span>}
        </span>
        <motion.span className="text-mute" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }}>
          <Plus size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <p className="max-w-xl px-2 pb-6 text-[15px] leading-relaxed text-mute md:pl-[calc(7rem+2rem)] md:pr-4">{a.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export default function Credentials() {
  const [open, setOpen] = useState(0)
  return (
    <section id="credentials" className="shell py-24 md:py-32">
      <SectionHead index="06" kicker="Recognition" title="Commendations along the way." highlight={['along', 'the', 'way.']} />

      <ul className="border-t border-line" onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(null)}>
        {awards.map((a, i) => (
          <AwardRow key={a.name} a={a} i={i} open={open === i} onOpen={setOpen} />
        ))}
      </ul>

      <div className="mt-20">
        <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          <BadgeCheck size={14} /> Certifications
        </h3>
        <Stagger className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {certs.map((c) => (
            <StaggerItem
              key={c.org}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="panel flex flex-col rounded-2xl p-5"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl">{c.org}</span>
                <span className="font-mono text-[11px] text-mute">×{c.items.length}</span>
              </div>
              <Stagger className="mt-4 flex flex-wrap gap-1.5" gap={0.05} delay={0.2}>
                {c.items.map((it) => (
                  <StaggerItem
                    key={it}
                    variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 20 } } }}
                    className="rounded-full bg-fg/[0.06] px-2.5 py-1 text-[13px]"
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
