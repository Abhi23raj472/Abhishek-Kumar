import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { Download, Moon, Sun, X } from 'lucide-react'
import { nav, profile } from '../data'
import { ease } from '../lib/motion'
import { lockScroll } from '../lib/smoothScroll'

const ids = nav.map((n) => n.id)
const resume = `./${profile.resume}`
const THEME_KEY = 'ak-portfolio-theme'
export const THEME_COLORS = { light: '#e4e8eb', dark: '#0b0f12' }

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

/** Light/dark switch. The page starts on the system setting; a choice made here is remembered. */
function ThemeToggle() {
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark')
  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[next])
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* storage blocked: the theme still applies for this visit */
    }
    setDark(!dark)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid h-11 w-11 place-items-center overflow-hidden border border-rule text-ink transition-colors hover:border-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.25, ease }}
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
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28 })

  // Tuck the bar away while scrolling down, bring it back on the way up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 320 && !open)
  })

  useEffect(() => {
    lockScroll(open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease }}
        className="fixed inset-x-0 top-0 z-[60] border-b border-rule bg-paper/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-5 md:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Abhishek Kumar, back to top">
            <span className="grid h-11 w-11 place-items-center bg-ink font-mono text-[13px] font-medium text-sheet">AK</span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[15px] font-semibold">Abhishek Kumar</span>
              <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2">Quality Engineer</span>
            </span>
          </a>

          <nav aria-label="Main" className="ml-auto hidden xl:block">
            <ul className="flex items-center">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`relative flex items-baseline gap-1.5 px-2.5 py-2 text-[14px] transition-colors ${
                      active === n.id ? 'text-ink' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    <span className={`figure font-mono text-[11px] ${active === n.id ? 'text-stamp' : ''}`}>{n.no}</span>
                    {n.label}
                    {active === n.id && (
                      <motion.span
                        layoutId="nav-mark"
                        className="absolute inset-x-2.5 -bottom-[13px] h-[2px] bg-stamp"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-4">
            <ThemeToggle />
            <a href={resume} download className="btn btn-solid hidden sm:inline-flex">
              <Download size={15} aria-hidden /> Resume
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center border border-rule hover:border-ink xl:hidden"
            >
              <span className="relative block h-2.5 w-4">
                <span className="absolute left-0 top-0 h-[1.5px] w-4 bg-current" />
                <span className="absolute bottom-0 left-0 h-[1.5px] w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
        {/* How far through the record you are. */}
        <motion.div aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-stamp" style={{ scaleX: progress }} />
      </motion.header>

      {/* Menu: the table of contents slides down like a page being pulled out. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-sheet text-ink xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Contents"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-rule px-5 md:px-8">
              <span className="label">Contents</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center bg-ink text-sheet">
                <X size={18} />
              </button>
            </div>
            <ol className="flex-1 px-5 pt-2 md:px-8">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  className="border-b border-rule"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.04 }}
                >
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-3.5">
                    <span className="figure w-8 font-mono text-[13px] text-stamp">{n.no}</span>
                    <span className="display text-[clamp(1.6rem,7vw,2.4rem)]">{n.label}</span>
                  </a>
                </motion.li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3 px-5 py-8 md:px-8">
              <a href={resume} download className="btn btn-solid">
                <Download size={15} aria-hidden /> Download resume
              </a>
              <a href={`mailto:${profile.email}`} className="btn btn-line">
                Email me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
