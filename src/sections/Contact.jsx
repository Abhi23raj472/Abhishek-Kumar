import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react'
import { profile } from '../data'
import { Reveal, Section, ease } from '../lib/motion'

const resume = `./${profile.resume}`

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

function CopyEmail() {
  const [copied, setCopied] = useState(false)
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
    <button type="button" onClick={copy} className="btn btn-line min-w-[150px] justify-center overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'y' : 'n'}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.2, ease }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? 'Copied' : 'Copy email'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function Contact() {
  const time = useIndiaTime()
  const year = new Date().getFullYear()
  return (
    <>
      <Section
        id="contact"
        no="7.0"
        label="Contact"
        title="Let's talk about your next release."
        intro="Have a quality engineering challenge, or want to talk test automation? Tell me about your release pipeline."
      >
        <Reveal>
          <a
            href={`mailto:${profile.email}`}
            className="display block break-all text-[clamp(1.35rem,4.2vw,3rem)] leading-tight decoration-stamp decoration-2 underline-offset-[0.18em] hover:text-stamp hover:underline"
          >
            {profile.email}
          </a>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn btn-solid">
            <Mail size={16} aria-hidden /> Email me
          </a>
          <CopyEmail />
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            LinkedIn <ArrowUpRight size={16} aria-hidden />
          </a>
          <a href={resume} download className="btn btn-line">
            <Download size={16} aria-hidden /> Resume
          </a>
        </Reveal>

        {/* sign-off block, as at the foot of an inspection record */}
        <Reveal delay={0.15} className="mt-14 grid border-l border-t border-ink sm:grid-cols-3">
          <div className="border-b border-r border-ink px-4 py-4">
            <p className="label">Inspected by</p>
            <p className="mt-6 border-b border-ink pb-1 text-[17px] font-bold" style={{ fontStretch: '112%' }}>
              {profile.name}
            </p>
            <p className="mt-1.5 text-[13px] text-ink-2">{profile.role}</p>
          </div>
          <div className="border-b border-r border-ink px-4 py-4">
            <p className="label">Location</p>
            <p className="mt-6 text-[17px] font-semibold">{profile.location}</p>
            <p className="figure mt-1.5 text-[13px] text-ink-2">{time ? `${time} IST` : 'IST, UTC+5:30'}</p>
          </div>
          <div className="border-b border-r border-ink px-4 py-4">
            <p className="label">Record</p>
            <p className="mt-6 text-[17px] font-semibold">Doc AK-QE-2026</p>
            <p className="mt-1.5 text-[13px] text-ink-2">Issued Oct 2026</p>
          </div>
        </Reveal>
      </Section>

      <footer className="pad flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink py-6 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-2">
        <span>
          © {year} {profile.name}
        </span>
        <a href="#top" className="inline-flex min-h-[44px] items-center gap-1.5 hover:text-ink">
          Back to top <ArrowUp size={14} aria-hidden />
        </a>
      </footer>
    </>
  )
}
