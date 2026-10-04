import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { Moon, Sun, X } from 'lucide-react'
import { nav, profile } from '../data'
import { Roll, ease } from '../lib/motion'
import { lockScroll } from '../lib/smoothScroll'

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

const THEME_KEY = 'ak-portfolio-theme'

/** Switches between the dark space theme and the light grey one, and remembers it. */
function ThemeToggle() {
  const [light, setLight] = useState(() => document.documentElement.dataset.theme === 'light')
  const toggle = () => {
    const next = light ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#eef1f5' : '#03050a')
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* storage blocked: the theme still applies for this visit */
    }
    setLight(!light)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      title={light ? 'Switch to dark theme' : 'Switch to light theme'}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors hover:border-accent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={light ? 'sun' : 'moon'}
          initial={{ y: 14, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          {light ? <Sun size={15} /> : <Moon size={15} />}
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
    lockScroll(open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Altitude rail: how far through the page you are. */}
      <div aria-hidden className="fixed bottom-[15vh] right-4 top-[15vh] z-[55] hidden w-px bg-line md:block">
        <motion.div className="h-full w-px origin-top bg-accent" style={{ scaleY: progress }} />
      </div>

      <motion.header
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease }}
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color] duration-300 ${
          scrolled ? 'border-line bg-bg/70 backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <div className="shell flex h-16 items-center gap-4">
          <a href="#top" className="font-display text-2xl italic" aria-label="Abhishek Kumar, back to top">
            Abhishek
          </a>

          <nav aria-label="Main" className="ml-auto hidden xl:block">
            <ul className="flex items-center">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`relative block px-3 py-2 text-[13px] transition-colors ${active === n.id ? 'text-fg' : 'text-mute hover:text-fg'}`}
                  >
                    <Roll>{n.label}</Roll>
                    {active === n.id && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-3">
            <ThemeToggle />
            <a
              href={resume}
              download
              className="hidden h-9 items-center rounded-full border border-line px-4 text-[13px] text-fg transition-colors hover:border-accent sm:inline-flex"
            >
              <Roll>Resume</Roll>
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-full border border-line xl:hidden"
            >
              <span className="relative block h-2.5 w-4">
                <span className="absolute left-0 top-0 h-px w-4 bg-current" />
                <span className="absolute bottom-0 left-0 h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen menu that grows out of the menu button. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 38px) 32px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 38px) 32px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 38px) 32px)' }}
            transition={{ duration: 0.6, ease }}
            className="fixed inset-0 z-[65] flex flex-col bg-bg/95 text-fg backdrop-blur-md xl:hidden"
          >
            <div className="shell flex h-16 items-center justify-between">
              <span className="label">Navigation</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-ink text-on-ink"
              >
                <X size={16} />
              </button>
            </div>
            <motion.ul
              className="shell flex-1 pt-4"
              initial="h"
              animate="s"
              variants={{ h: {}, s: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }}
            >
              {nav.map((n) => (
                <motion.li key={n.id} className="overflow-hidden border-b border-line" variants={{ h: { y: '100%' }, s: { y: '0%', transition: { duration: 0.5, ease } } }}>
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="block py-3">
                    <span className="font-display text-3xl">
                      <Roll>{n.label}</Roll>
                    </span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="shell flex flex-wrap gap-3 py-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <a href={resume} download className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink">Download resume</a>
              <a href={`mailto:${profile.email}`} className="rounded-full border border-line px-5 py-2.5 text-sm font-medium">Email me</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
