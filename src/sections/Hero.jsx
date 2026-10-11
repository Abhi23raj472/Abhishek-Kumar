import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Download, Mail } from 'lucide-react'
import { profile, record, stats } from '../data'
import { Counter, ease } from '../lib/motion'

const resume = `./${profile.resume}`

/**
 * The inspector's rubber stamp, in ultramarine ink. A noise filter knocks
 * small gaps out of the ink so it reads as pressed, not printed.
 */
function Stamp({ className = '', delay = 1 }) {
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const ring = `M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0`
  return (
    // The tilt lives on this wrapper so the stamp keeps it before JavaScript runs.
    <div className={`pointer-events-none rotate-[-12deg] ${className}`} aria-hidden>
      <motion.div
        className="relative"
        initial={reduce ? false : { opacity: 0, scale: 1.7, rotate: 9 }}
        animate={{ opacity: 0.94, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 24, delay }}
      >
        {/* the ink spreading on impact */}
        {!reduce && (
          <motion.span
            className="absolute inset-[6%] rounded-full border-2 border-stamp"
            initial={{ opacity: 0, scale: 1 }}
            // ends back at its own size so it never widens the page
            animate={{ opacity: [0, 0.5, 0, 0], scale: [1, 1, 1.35, 1] }}
            transition={{ duration: 0.7, delay: delay + 0.12, times: [0, 0.1, 0.98, 1] }}
          />
        )}
        <svg viewBox="0 0 200 200" className="block h-full w-full text-stamp">
          <defs>
            <filter id={`ink-${id}`} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.65" result="m" />
              <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
              <feDisplacementMap in="c" in2="n" scale="2.2" />
            </filter>
            <path id={`ring-${id}`} d={ring} />
          </defs>
          <g filter={`url(#ink-${id})`} fill="currentColor" stroke="currentColor">
            <circle cx="100" cy="100" r="94" fill="none" strokeWidth="5" />
            <circle cx="100" cy="100" r="66" fill="none" strokeWidth="1.6" />
            <text className="font-mono" fontSize="12.5" fontWeight="600" stroke="none" letterSpacing="2">
              <textPath href={`#ring-${id}`} textLength="492" lengthAdjust="spacing">
                QUALITY ENGINEER ✦ INSPECTED ✦ SINCE 2021 ✦
              </textPath>
            </text>
            <text x="100" y="84" textAnchor="middle" className="font-mono" fontSize="11" fontWeight="600" stroke="none" letterSpacing="2">
              5+ YRS
            </text>
            <text x="100" y="113" textAnchor="middle" fontSize="31" fontWeight="800" stroke="none" style={{ fontStretch: '125%' }}>
              PASSED
            </text>
            <line x1="56" y1="124" x2="144" y2="124" strokeWidth="1.6" />
            <text x="100" y="140" textAnchor="middle" className="font-mono" fontSize="10" fontWeight="600" stroke="none" letterSpacing="2">
              AK · 2026
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}

/** One line of the name, sliding up out of its own mask on load. */
function NameLine({ children, delay }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '105%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

export default function Hero() {
  return (
    <section id="top" className="pad pb-14 pt-24 md:pb-20 md:pt-32">
      {/* document header line */}
      <motion.div {...fade(0)} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink pb-3">
        <p className="label text-ink">Quality inspection record</p>
        <p className="label figure">Doc AK-QE-2026 · Issued Oct 2026</p>
      </motion.div>

      <div className="relative">
        <h1 className="display mt-8 text-[clamp(2.7rem,10.5vw,8.6rem)] uppercase md:mt-12">
          <span className="sr-only">Abhishek Kumar, Quality Engineer</span>
          <span aria-hidden>
            <NameLine delay={0.1}>Abhishek</NameLine>
            <NameLine delay={0.22}>
              Kumar<span className="text-stamp">.</span>
            </NameLine>
          </span>
        </h1>
        <Stamp className="absolute right-0 top-[44%] hidden h-48 w-48 lg:block xl:right-4 xl:h-56 xl:w-56" />
      </div>

      <div className="mt-8 flex items-start justify-between gap-5 md:mt-10">
        <motion.p {...fade(0.45)} className="max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-snug">
          <strong className="font-semibold">Quality Engineer</strong> at Optum, building Tricentis Tosca automation for web, desktop and API
          testing, so teams release with speed and confidence.
        </motion.p>
        <Stamp className="-mt-4 h-28 w-28 shrink-0 sm:h-36 sm:w-36 lg:hidden" delay={0.9} />
      </div>

      <motion.div {...fade(0.6)} className="mt-8 flex flex-wrap gap-3">
        <a href={resume} download className="btn btn-solid">
          <Download size={16} aria-hidden /> Download resume
        </a>
        <a href={`mailto:${profile.email}`} className="btn btn-line">
          <Mail size={16} aria-hidden /> Email
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-line">
          LinkedIn <ArrowUpRight size={16} aria-hidden />
        </a>
      </motion.div>

      {/* title block: who and what is being inspected */}
      <motion.dl
        {...fade(0.75)}
        className="mt-12 grid grid-cols-1 border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-3 md:mt-16"
      >
        {record.map(([k, v]) => (
          <div key={k} className="min-w-0 border-b border-r border-ink px-4 py-3">
            <dt className="label">{k}</dt>
            <dd className="mt-1 text-[15px] font-medium">{v}</dd>
          </div>
        ))}
      </motion.dl>

      {/* result summary */}
      <motion.div {...fade(0.9)} className="mt-6 grid grid-cols-2 gap-px border border-ink bg-ink lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="bg-sheet px-4 py-5">
            <p className="display text-[clamp(2.2rem,4vw,3.2rem)]">
              <Counter to={s.v} suffix={s.suffix} />
            </p>
            <p className="mt-2 max-w-[22ch] text-[13px] leading-snug text-ink-2">{s.k}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
