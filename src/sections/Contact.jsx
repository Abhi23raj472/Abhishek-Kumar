import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react'
import { nav, profile } from '../data'
import { Magnetic, RevealWords, Roll, ease } from '../lib/motion'

const resume = `${import.meta.env.BASE_URL}${profile.resume}`
const socials = [
  { k: 'LinkedIn', href: profile.linkedin },
  { k: 'GitHub', href: profile.github },
  { k: 'Résumé', href: resume, download: true },
]
const label = 'font-mono text-[11px] uppercase tracking-[0.18em] text-mute'

function useIndiaTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }))
    f()
    const id = setInterval(f, 30_000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Contact() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const time = useIndiaTime()

  // The headline settles into place as the footer scrolls up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden border-t border-line pt-24 md:pt-32">
      <div className="shell">
        <p className={label}>
          <span className="text-accent">08</span>&nbsp;&nbsp;&nbsp;Contact
        </p>

        <motion.h2
          style={reduce ? undefined : { scale, y, opacity }}
          className="mt-6 max-w-3xl origin-bottom-left text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em]"
        >
          Let's build quality into your <span className="text-mute">next release.</span>
        </motion.h2>

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <RevealWords
            text="Open to Quality Engineering and Test Automation roles. Tell me about your release pipeline and I'll help it ship faster, with confidence."
            className="max-w-md text-base leading-relaxed text-mute md:col-span-6"
          />
          <div className="flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end">
            <Magnetic>
              <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink">
                <Roll>Get in touch</Roll>
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-w-[15.5rem] items-center justify-center overflow-hidden rounded-full border border-line px-5 py-2.5 font-mono text-[13px] transition-colors hover:bg-fg/5"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'y' : 'n'}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                  className="inline-flex items-center gap-2"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied to clipboard' : profile.email}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line py-10 text-sm sm:grid-cols-3">
          <div>
            <p className={label}>Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.k}>
                  <a
                    href={s.href}
                    {...(s.download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="group inline-flex items-center gap-1 text-mute hover:text-fg"
                  >
                    <Roll>{s.k}</Roll>
                    <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={label}>Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {nav.slice(0, -1).map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="text-mute hover:text-fg"><Roll>{n.label}</Roll></a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:text-right">
            <p className={label}>Local time</p>
            <p className="mt-4 text-lg tabular-nums">
              {time} <span className="text-xs text-mute">IST</span>
            </p>
            <a href="#top" className="group mt-4 inline-flex items-center gap-1.5 text-mute hover:text-fg">
              <Roll>Back to top</Roll> <ArrowUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-wrap justify-between gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with React &amp; Framer Motion</span>
        </div>
      </div>
    </footer>
  )
}
