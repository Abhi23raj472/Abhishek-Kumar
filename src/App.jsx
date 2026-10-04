import { useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import VelocityMarquee from './components/VelocityMarquee'
import { marquee } from './data'
import { useSmoothScroll } from './lib/smoothScroll'
import About from './sections/About'
import Contact from './sections/Contact'
import Credentials from './sections/Credentials'
import Experience from './sections/Experience'
import GitHub from './sections/GitHub'
import Hero from './sections/Hero'
import Impact from './sections/Impact'
import Skills from './sections/Skills'
import Work from './sections/Work'

// The intro plays once per browser session, and never with reduced motion.
function shouldShowIntro() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.location.hash) return false
    if (sessionStorage.getItem('ak-intro-seen')) return false
  } catch {
    /* storage blocked: still show it */
  }
  return true
}

export default function App() {
  const [loading, setLoading] = useState(shouldShowIntro)
  const done = useCallback(() => {
    try {
      sessionStorage.setItem('ak-intro-seen', '1')
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])
  useSmoothScroll(loading)

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader key="intro" onDone={done} />}</AnimatePresence>
      <Cursor />
      <Nav />
      <main>
        <Hero ready={!loading} />
        <VelocityMarquee items={marquee} />
        <About />
        <Work />
        <Experience />
        <Impact />
        <Skills />
        <GitHub />
        <Credentials />
      </main>
      <Contact />
    </MotionConfig>
  )
}
