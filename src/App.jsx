import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import { useSmoothScroll } from './lib/smoothScroll'
import About from './sections/About'
import Contact from './sections/Contact'
import Credentials from './sections/Credentials'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Impact from './sections/Impact'
import Skills from './sections/Skills'
import Work from './sections/Work'

export default function App() {
  useSmoothScroll()
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      {/* the whole record is one document sheet */}
      <div className="sheet">
        <main>
          <Hero />
          <About />
          <Work />
          <Impact />
          <Experience />
          <Skills />
          <Credentials />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  )
}
