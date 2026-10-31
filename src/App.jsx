import { Suspense, lazy, useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import { useSmoothScroll } from './lib/smoothScroll'
import About from './sections/About'
import Contact from './sections/Contact'
import Credentials from './sections/Credentials'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Impact from './sections/Impact'
import Skills from './sections/Skills'
import Work from './sections/Work'

// three.js is large, so the sky loads in its own chunk while the page renders.
const SpaceScene = lazy(() => import('./components/SpaceScene'))

// The intro plays once per browser session, and never with reduced motion.
function shouldShowIntro() {
  if (typeof window === 'undefined') return false // pre-rendering at build time
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.location.hash) return false
    if (sessionStorage.getItem('ak-intro-seen')) return false
    // Slow connection: the visitor has already been reading the page, don't cover it.
    if (performance.now() > 1500) return false
  } catch {
    /* storage blocked: still show it */
  }
  return true
}

/** A thin bar along the top edge that fills as you read down the page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden className="scroll-progress fixed inset-x-0 top-0 z-[60] h-px origin-left" style={{ scaleX }} />
}

export default function App() {
  const [loading, setLoading] = useState(shouldShowIntro)
  const [intro] = useState(loading)
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
      <div aria-hidden className="sky-fallback fixed inset-0 -z-30" />
      <Suspense fallback={null}>
        <SpaceScene launched={!loading} />
      </Suspense>
      <AnimatePresence>{loading && <Preloader key="intro" onDone={done} />}</AnimatePresence>
      <Cursor />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero ready={!loading} intro={intro} />
        <About />
        <Work />
        <Impact />
        <Experience />
        <Skills />
        <Credentials />
      </main>
      <Contact />
    </MotionConfig>
  )
}
