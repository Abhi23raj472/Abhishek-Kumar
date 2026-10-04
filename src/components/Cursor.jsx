import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const IDLE = 26
const PAD = 7
const spring = { stiffness: 420, damping: 34, mass: 0.6 }

/**
 * A targeting reticle: a dot that tracks the pointer exactly, and four corner
 * brackets that trail it and snap around whatever link or button you point
 * at. The native cursor stays visible; fine pointers only.
 */
export default function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [locked, setLocked] = useState(false)
  const target = useRef(null)
  const pointer = useRef({ x: -100, y: -100 })

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const x = useSpring(-100, spring)
  const y = useSpring(-100, spring)
  const w = useSpring(IDLE, spring)
  const h = useSpring(IDLE, spring)

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    // Re-measure every frame so the brackets stay on a target while the page scrolls.
    const place = () => {
      const el = target.current
      if (el && el.isConnected) {
        const r = el.getBoundingClientRect()
        x.set(r.left - PAD)
        y.set(r.top - PAD)
        w.set(r.width + PAD * 2)
        h.set(r.height + PAD * 2)
      } else {
        x.set(pointer.current.x - IDLE / 2)
        y.set(pointer.current.y - IDLE / 2)
        w.set(IDLE)
        h.set(IDLE)
      }
      raf = requestAnimationFrame(place)
    }
    raf = requestAnimationFrame(place)

    const move = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      setVisible(true)
    }
    const over = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      target.current = el
      setLocked(!!el)
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y, w, h, dotX, dotY])

  if (!enabled) return null
  const corner = 'absolute h-2 w-2 border-accent'
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90]"
        style={{ x, y, width: w, height: h }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div className="absolute inset-0" animate={{ rotate: locked ? 0 : 45 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
          <i className={`${corner} left-0 top-0 border-l border-t`} />
          <i className={`${corner} right-0 top-0 border-r border-t`} />
          <i className={`${corner} bottom-0 left-0 border-b border-l`} />
          <i className={`${corner} bottom-0 right-0 border-b border-r`} />
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1 w-1 rounded-full bg-accent"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0 }}
      />
    </>
  )
}
