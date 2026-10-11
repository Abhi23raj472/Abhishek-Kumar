import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { doing } from '../data'
import { Check, Section, ease, isServer } from '../lib/motion'

/** One line of the checklist: the box gets its tick as the row scrolls into view. */
function Item({ d, i }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  const on = isServer || seen
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, ease, delay: i * 0.05 }}
      className="group grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-rule py-6 transition-colors hover:bg-stamp-wash md:grid-cols-[32px_88px_minmax(0,240px)_minmax(0,1fr)] md:items-baseline md:px-3"
    >
      <span className={`grid h-7 w-7 place-items-center border-2 transition-colors duration-300 md:translate-y-1.5 ${on ? 'border-pass text-pass' : 'border-rule text-transparent'}`}>
        <Check on={on} delay={0.15} className="h-5 w-5" />
      </span>
      <span className="figure col-start-2 row-start-1 font-mono text-[12px] text-ink-2 md:col-auto md:row-auto">{d.code}</span>
      <h3 className="col-start-2 text-[19px] font-bold leading-tight md:col-auto" style={{ fontStretch: '112%' }}>
        {d.title}
      </h3>
      <p className="col-start-2 max-w-[56ch] text-ink-2 md:col-auto">{d.body}</p>
    </motion.li>
  )
}

export default function Work() {
  return (
    <Section
      id="work"
      no="2.0"
      label="Scope"
      title="What I'm trusted to cover."
      intro="The work I own day to day, from building Tosca suites to closing defects with developers."
    >
      <ul className="border-t border-ink">
        {doing.map((d, i) => (
          <Item key={d.code} d={d} i={i} />
        ))}
      </ul>
    </Section>
  )
}
