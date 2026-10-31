import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// One Lenis instance for the page. It eases the native window scroll, so
// Framer Motion's useScroll and CSS position: sticky keep working unchanged.
let lenis = null

/**
 * Smooth, inertia-style wheel scrolling, held still while `paused`.
 * Off when reduced motion is requested.
 */
export function useSmoothScroll(paused = false) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      // In-page links glide to their section; CSS scroll-padding-top clears the header.
      anchors: { force: true },
    })
    return () => {
      lenis.destroy()
      lenis = null
    }
  }, [])

  useEffect(() => {
    if (paused) lenis?.stop()
    else lenis?.start()
  }, [paused])
}

/** Freeze page scrolling (preloader, mobile menu) and release it again. */
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}
