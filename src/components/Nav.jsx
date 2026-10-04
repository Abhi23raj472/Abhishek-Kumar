import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { Moon, Sun, X } from 'lucide-react'
import { nav, profile } from '../data'
import { ease } from '../lib/motion'

const ids = nav.map((n) => n.id)
const resume = `${import.meta.env.BASE_URL}${profile.resume}`

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0a0b0d' : '#f3f1ea')
    try {
      localStorage.setItem('ak-portfolio-theme', next)
    } catch {
      /* storage blocked: theme still applies for this visit */
    }
    setDark(!dark)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors hover:bg-fg/5"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default function Nav() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })

  // Tuck the bar away while scrolling down, bring it back on the way up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 240 && !open)
    setScrolled(y > 24)
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-lime"
      />

      <motion.header
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease }}
        className="fixed inset-x-0 top-0 z-[60]"
      >
        <div
          className={`shell flex h-[72px] items-center gap-4 transition-[background-color,border-color,backdrop-filter] duration-300 ${
            scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
          }`}
          style={{ maxWidth: 'none' }}
        >
          <a href="#top" className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight" aria-label="Abhishek Kumar, back to top">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-fg text-sm text-bg transition-transform duration-500 group-hover:rotate-[360deg]">
              AK
            </span>
            <span className="hidden sm:inline">{profile.name}</span>
          </a>

          <nav aria-label="Main" className="ml-auto hidden xl:block">
            <ul className="flex items-center rounded-full border border-line p-1">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`relative isolate block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                      active === n.id ? 'text-on-lime' : 'text-mute hover:text-fg'
                    }`}
                  >
                    {active === n.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-lime"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <ThemeToggle />
            <a
              href={resume}
              download
              className="hidden h-10 items-center rounded-full bg-fg px-5 text-sm font-semibold text-bg transition-opacity hover:opacity-85 sm:inline-flex"
            >
              Résumé ↓
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative z-[80] grid h-10 w-10 place-items-center rounded-full bg-lime text-on-lime xl:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 h-[1.5px] w-4 bg-current" />
                <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="absolute left-0 top-[5px] h-[1.5px] w-4 bg-current" />
                <motion.span animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-[10px] h-[1.5px] w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen menu that grows out of the menu button. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[65] flex flex-col bg-fg text-bg xl:hidden"
          >
            <div className="shell flex h-[72px] items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-lime text-on-lime"
              >
                <X size={18} />
              </button>
            </div>
            <motion.ul
              className="shell flex-1 pt-6"
              initial="h"
              animate="s"
              variants={{ h: {}, s: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
            >
              {nav.map((n, i) => (
                <motion.li key={n.id} className="overflow-hidden border-b border-bg/15" variants={{ h: { y: '100%' }, s: { y: '0%', transition: { duration: 0.6, ease } } }}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-3">
                    <span className="font-display text-[clamp(2rem,8vw,3.5rem)] font-semibold tracking-tight">{n.label}</span>
                    <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="shell flex flex-wrap gap-3 py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <a href={resume} download className="rounded-full bg-lime px-5 py-3 font-semibold text-on-lime">Download résumé</a>
              <a href={`mailto:${profile.email}`} className="rounded-full border border-bg/30 px-5 py-3 font-semibold">Email me</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
