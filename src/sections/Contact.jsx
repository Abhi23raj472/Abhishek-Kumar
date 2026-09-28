import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data'
import { Magnetic, Reveal, Spotlight, ease } from '../components/motion'

const links = [
  { k: 'linkedin', v: 'in/abhishek-kumar2301', href: profile.linkedin },
  { k: 'github', v: `github.com/${profile.githubUser}`, href: profile.github },
  { k: 'email', v: profile.email, href: `mailto:${profile.email}` },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const t = document.createElement('textarea')
      t.value = profile.email
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Spotlight className="overflow-hidden p-8 md:p-14">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-pass/15 blur-[100px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <Reveal className="font-mono text-xs uppercase tracking-[0.2em] text-pass">07 — Contact</Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
            Let's build quality into your <span className="text-gradient">next release</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-lg">
            I'm open to Quality Engineering and Test Automation opportunities. Let's talk about how I can help your team
            ship faster, with confidence.
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-9 flex flex-wrap items-center gap-3">
          <Magnetic>
            <button
              onClick={copy}
              className="relative inline-flex min-w-[190px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-pass px-6 py-3.5 font-semibold text-ink"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'y' : 'n'}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                >
                  {copied ? '✓ Email copied' : 'Copy email'}
                </motion.span>
              </AnimatePresence>
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-line-2 px-6 py-3.5 font-semibold text-fg hover:bg-white/5"
            >
              Open in Gmail ↗
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resume}
              download
              className="inline-flex items-center gap-2 rounded-2xl border border-line-2 px-6 py-3.5 font-semibold text-fg hover:bg-white/5"
            >
              Download résumé ↓
            </a>
          </Magnetic>
        </Reveal>

        <div className="mt-12 grid gap-3 border-t border-line pt-8 md:grid-cols-3">
          {links.map((l, i) => (
            <motion.a
              key={l.k}
              href={l.href}
              target={l.k === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              whileHover={{ y: -3 }}
              className="group flex items-center justify-between rounded-2xl border border-line bg-white/[0.02] p-5 transition-colors hover:border-pass/40"
            >
              <span className="min-w-0">
                <span className="block font-mono text-xs text-mute">{l.k}</span>
                <span className="mt-1 block truncate text-fg">{l.v}</span>
              </span>
              <span className="ml-3 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pass">↗</span>
            </motion.a>
          ))}
        </div>
      </Spotlight>
    </section>
  )
}
