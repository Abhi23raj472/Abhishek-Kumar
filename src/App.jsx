import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Impact from './sections/Impact'
import GitHub from './sections/GitHub'
import Credentials from './sections/Credentials'
import Contact from './sections/Contact'
import { profile } from './data'

export default function App() {
  // The page renders after load, so the browser can't jump to a #hash on its own.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Impact />
        <GitHub />
        <Credentials />
        <Contact />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-8 font-mono text-xs text-mute md:px-8">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.role} · {profile.focus}</span>
        <a href="#top" className="hover:text-fg">Back to top ↑</a>
      </footer>
    </MotionConfig>
  )
}
