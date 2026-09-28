import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { nav, profile } from '../data'
import { ease } from './motion'

function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [ids])
  return active
}

const ids = nav.map((n) => n.id)

export default function Nav() {
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const pill = hover ?? active

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-pass to-cyan"
      />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="fixed inset-x-0 top-3 z-50 px-4"
      >
        <nav className="mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border border-line bg-ink/70 px-3 py-2 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-fg">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-pass/15 font-display text-sm font-bold text-pass">AK</span>
            <span className="font-display font-semibold">{profile.name}</span>
          </a>

          <ul className="ml-auto hidden items-center lg:flex" onPointerLeave={() => setHover(null)}>
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onPointerEnter={() => setHover(n.id)}
                  className={`relative block rounded-lg px-3 py-2 font-mono text-[12.5px] transition-colors ${active === n.id ? 'text-fg' : 'text-mute hover:text-fg'}`}
                >
                  {pill === n.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={profile.resume}
            download
            className="ml-auto hidden rounded-xl bg-fg px-4 py-2 text-sm font-semibold text-ink transition hover:bg-pass sm:inline-flex lg:ml-2"
          >
            Résumé ↓
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="ml-auto grid h-10 w-10 place-items-center rounded-xl border border-line text-fg sm:ml-0 lg:hidden"
          >
            <div className="relative h-3 w-4">
              <motion.span animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-0 h-[1.5px] w-4 bg-current" />
              <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="absolute left-0 top-[5px] h-[1.5px] w-4 bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} className="absolute left-0 top-[10px] h-[1.5px] w-4 bg-current" />
            </div>
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease }}
              className="mx-auto mt-2 max-w-6xl rounded-2xl border border-line bg-panel/95 p-3 backdrop-blur-xl lg:hidden"
            >
              <motion.ul
                initial="h"
                animate="s"
                variants={{ h: {}, s: { transition: { staggerChildren: 0.04 } } }}
              >
                {nav.map((n, i) => (
                  <motion.li key={n.id} variants={{ h: { opacity: 0, x: -12 }, s: { opacity: 1, x: 0 } }}>
                    <a
                      href={`#${n.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-fg hover:bg-white/5"
                    >
                      <span className="font-display text-lg">{n.label}</span>
                      <span className="font-mono text-xs text-mute">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <a
                href={profile.resume}
                download
                className="mt-2 block rounded-xl bg-pass px-4 py-3 text-center font-semibold text-ink"
              >
                Download résumé (PDF)
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
