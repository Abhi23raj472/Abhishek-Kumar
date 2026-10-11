import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { impact } from '../data'
import { Check, Section, ease, isServer } from '../lib/motion'

// The resume states the direction of each result, not a figure, so the table shows the direction only.
const EFFECT = {
  down: { glyph: '↓', verb: 'Reduced' },
  up: { glyph: '↑', verb: 'Increased' },
  zero: { glyph: '0', verb: 'Held at zero' },
  early: { glyph: '◷', verb: 'Ahead of schedule' },
}

/** Each finding is re-run as it scrolls into view: queued, running, then passed. */
function useRun(ref, delay, onPass) {
  const seen = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduce = useReducedMotion()
  const [state, setState] = useState(isServer ? 'pass' : 'queued')
  useEffect(() => {
    if (!seen || state !== 'queued') return
    if (reduce) {
      setState('pass')
      onPass()
      return
    }
    const a = setTimeout(() => setState('running'), delay)
    const b = setTimeout(() => {
      setState('pass')
      onPass()
    }, delay + 900)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [seen]) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}

function Status({ state }) {
  if (state === 'pass')
    return (
      <span className="inline-flex items-center gap-1.5 bg-pass-wash px-2 py-1 font-mono text-[12px] font-semibold text-pass">
        <Check className="h-3.5 w-3.5" /> PASS
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[12px] text-ink-2">
      {state === 'running' ? (
        <motion.span
          className="h-3 w-3 rounded-full border-2 border-rule border-t-stamp"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        />
      ) : (
        <span className="h-3 w-3 border border-rule" />
      )}
      {state === 'running' ? 'RUNNING' : 'QUEUED'}
    </span>
  )
}

function Row({ f, i, onPass }) {
  const ref = useRef(null)
  const state = useRun(ref, (i % 3) * 180, onPass)
  const e = EFFECT[f.dir]
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, ease }}
      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 border-b border-rule py-5 md:grid-cols-[64px_minmax(0,1fr)_220px_96px] md:items-start md:px-3"
    >
      <span className="figure font-mono text-[12px] text-ink-2 md:pt-1">{f.code}</span>
      <div className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:row-start-auto">
        <h3 className="text-[18px] font-bold leading-tight" style={{ fontStretch: '112%' }}>
          {f.title}
        </h3>
        <p className="mt-1.5 max-w-[58ch] text-[15px] text-ink-2">{f.body}</p>
      </div>
      <div className="col-span-2 row-start-3 flex items-center gap-3 md:col-span-1 md:row-start-auto">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-ink text-[18px] font-bold">{e.glyph}</span>
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold">{e.verb}</span>
          <span className="block text-[13px] text-ink-2">{f.metric}</span>
        </span>
      </div>
      <div className="col-start-2 row-start-1 justify-self-end md:col-auto md:row-auto md:pt-0.5">
        <Status state={state} />
      </div>
    </motion.li>
  )
}

export default function Impact() {
  const [passed, setPassed] = useState(isServer ? impact.length : 0)
  const pass = () => setPassed((n) => n + 1)
  const total = impact.length
  return (
    <Section
      id="impact"
      no="3.0"
      label="Findings"
      title="Measured results."
      intro="Outcomes from my time at Expleo and Optum, re-checked as you read them."
    >
      {/* run summary */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-ink py-3">
        <p className="figure font-mono text-[13px] font-medium">
          {passed}/{total} passed · 0 failed
        </p>
        <div className="h-2 min-w-[120px] flex-1 bg-rule" aria-hidden>
          <motion.div className="h-full bg-pass" animate={{ width: `${(passed / total) * 100}%` }} transition={{ duration: 0.5, ease }} />
        </div>
      </div>
      <div className="hidden grid-cols-[64px_minmax(0,1fr)_220px_96px] gap-x-4 px-3 pb-2 pt-4 md:grid" aria-hidden>
        {['ID', 'Finding', 'Effect', 'Result'].map((h) => (
          <span key={h} className="label">
            {h}
          </span>
        ))}
      </div>
      <ul className="border-t border-rule md:border-ink">
        {impact.map((f, i) => (
          <Row key={f.code} f={f} i={i} onPass={pass} />
        ))}
      </ul>
    </Section>
  )
}
