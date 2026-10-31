import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { Check, Palette, X } from 'lucide-react'
import { nav, profile } from '../data'
import { Roll, ease } from '../lib/motion'
import { lockScroll } from '../lib/smoothScroll'

const ids = nav.map((n) => n.id)
const resume = `./${profile.resume}`

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

// Every palette lives in index.css under :root[data-theme="…"]; these are the swatches shown in the picker.
export const THEMES = [
  { id: 'dark', name: 'Mission blue', mode: 'Dark', sw: ['#060b22', '#7fb2ff', '#f4c27a'] },
  { id: 'aurora', name: 'Aurora', mode: 'Dark', sw: ['#031a1b', '#5eead4', '#c4b5fd'] },
  { id: 'nebula', name: 'Nebula', mode: 'Dark', sw: ['#100827', '#d0a8ff', '#ff9ec7'] },
  { id: 'supernova', name: 'Supernova', mode: 'Dark', sw: ['#180a06', '#ff8a5b', '#ffd166'] },
  { id: 'eclipse', name: 'Eclipse', mode: 'Dark', sw: ['#000000', '#ffffff', '#e8c27a'] },
  { id: 'light', name: 'Solar flare', mode: 'Light', sw: ['#f7f3ec', '#a9530a', '#1d5f9e'] },
  { id: 'arctic', name: 'Arctic', mode: 'Light', sw: ['#eef4f8', '#0b6e99', '#b5307a'] },
]

function applyTheme(id, from) {
  const root = document.documentElement
  const set = () => {
    root.dataset.theme = id
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
    try {
      localStorage.setItem(THEME_KEY, id)
    } catch {
      /* storage blocked: the theme still applies for this visit */
    }
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) return set()
  // The new palette spreads out in a circle from the swatch that was clicked.
  const x = from?.x ?? window.innerWidth - 40
  const y = from?.y ?? 40
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const t = document.startViewTransition(set)
  t.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {})
}

/** Opens a list of colour themes and remembers the one picked. */
function ThemePicker() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(() => (typeof document !== 'undefined' && document.documentElement.dataset.theme) || 'dark')
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => !e.target.closest?.('[data-theme-picker]') && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])
  const active = THEMES.find((t) => t.id === current) || THEMES[0]
  const pick = (t, e) => {
    setCurrent(t.id)
    applyTheme(t.id, e && e.clientX ? { x: e.clientX, y: e.clientY } : undefined)
    setOpen(false)
  }
  return (
    <div className="relative" data-theme-picker>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Colour theme: ${active.name}`}
        title="Change colour theme"
        className="relative grid h-9 w-9 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent"
      >
        <Palette size={15} />
        <span aria-hidden className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-bg bg-accent" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="radiogroup"
            aria-label="Colour theme"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease }}
            className="panel absolute right-0 top-11 z-50 w-60 rounded-2xl p-1.5 shadow-2xl"
          >
            <p className="label px-2.5 pb-1.5 pt-2">Colour theme</p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={t.id === current}
                onClick={(e) => pick(t, e)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-surface-2 ${t.id === current ? 'bg-surface-2' : ''}`}
              >
                <span aria-hidden className="flex -space-x-1.5">
                  {t.sw.map((c, i) => (
                    <span key={i} className="h-5 w-5 rounded-full border border-line" style={{ background: c }} />
                  ))}
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-fg">{t.name}</span>
                  <span className="block text-[11px] text-mute">{t.mode}</span>
                </span>
                {t.id === current && <Check size={14} className="text-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
            <ThemePicker />
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
              <a href={resume} download className="btn-glow rounded-full px-5 py-2.5 text-sm font-medium">Download resume</a>
              <a href={`mailto:${profile.email}`} className="rounded-full border border-line px-5 py-2.5 text-sm font-medium">Email me</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
