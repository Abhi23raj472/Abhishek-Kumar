import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react'
import { nav, profile } from '../data'
import { Magnetic, ease } from '../lib/motion'

const resume = `${import.meta.env.BASE_URL}${profile.resume}`
const socials = [
  { k: 'LinkedIn', href: profile.linkedin },
  { k: 'GitHub', href: profile.github },
  { k: 'Résumé', href: resume, download: true },
]

function useIndiaTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = () =>
      setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }))
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

  // The headline grows into place as the footer scrolls up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.2'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const y = useTransform(scrollYProgress, [0, 1], [120, 0])
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 0])

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
    <footer id="contact" ref={ref} className="relative overflow-hidden border-t border-white/10 bg-[#0a0b0d] pt-24 text-[#eceef1] md:pt-36">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60 [--grid:rgb(255_255_255/0.04)]" />
      <div className="shell relative">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
          <span className="text-lime">(08)</span> Contact
        </p>

        <motion.h2
          style={reduce ? undefined : { scale, y, rotate }}
          className="mt-8 origin-bottom-left font-display text-[clamp(3.4rem,11vw,11rem)] font-semibold leading-[0.88] tracking-[-0.055em]"
        >
          Let's ship
          <br />
          it <span className="text-lime">right.</span>
        </motion.h2>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          <p className="max-w-md text-lg leading-relaxed text-white/70 md:col-span-5">
            Open to Quality Engineering and Test Automation roles. Tell me about your release pipeline — I'll help it
            ship faster, with confidence.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
            <Magnetic strength={0.35}>
              <a
                href={`mailto:${profile.email}`}
                className="group relative grid h-36 w-36 place-items-center rounded-full bg-lime text-center font-semibold text-[#0a0b0d] md:h-44 md:w-44"
              >
                <span className="flex flex-col items-center gap-1">
                  <ArrowUpRight size={26} className="transition-transform duration-300 group-hover:rotate-45" />
                  Get in touch
                </span>
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-w-[15rem] items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 px-6 py-4 font-mono text-sm transition-colors hover:bg-white/5"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'y' : 'n'}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                  className="inline-flex items-center gap-2"
                >
                  {copied ? <Check size={16} className="text-lime" /> : <Copy size={16} />}
                  {copied ? 'Copied to clipboard' : profile.email}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="mt-20 grid gap-10 border-t border-white/15 py-10 text-sm sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {socials.map((s) => (
                <li key={s.k}>
                  <a
                    href={s.href}
                    {...(s.download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="group inline-flex items-center gap-1.5 hover:text-lime"
                  >
                    {s.k}
                    <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {nav.slice(0, -1).map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="hover:text-lime">{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">Local time</p>
            <p className="mt-4 font-display text-2xl tabular-nums">{time} <span className="text-sm text-white/50">IST</span></p>
            <a href="#top" className="group mt-6 inline-flex items-center gap-2 hover:text-lime">
              Back to top <ArrowUp size={16} className="transition-transform group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>

      <div aria-hidden className="relative select-none overflow-hidden">
        <motion.p
          initial={{ y: '60%' }}
          whileInView={{ y: '0%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="whitespace-nowrap text-center font-display text-[20vw] font-bold leading-[0.75] tracking-[-0.03em] text-white/[0.06]"
        >
          ABHISHEK
        </motion.p>
      </div>
      <p className="shell relative py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
        © {new Date().getFullYear()} {profile.name} · Built with React &amp; Framer Motion
      </p>
    </footer>
  )
}
