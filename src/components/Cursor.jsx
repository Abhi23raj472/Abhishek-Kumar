import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'

/**
 * A soft blob that trails the mouse with a little lag and inverts whatever
 * it passes over. It shrinks away over links and buttons, which have their own
 * hover effects. The native cursor stays visible; fine pointers only.
 */
export default function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hidden, setHidden] = useState(true)
  const target = useRef({ x: -100, y: -100 })
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches && !reduce)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    let first = true
    const move = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (first) {
        x.set(e.clientX)
        y.set(e.clientY)
        first = false
      }
    }
    const over = (e) => setHidden(!!e.target.closest('a, button, input, textarea'))
    const leave = () => setHidden(true)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  // Ease a fraction of the remaining distance each frame (frame-rate independent).
  useAnimationFrame((_, delta) => {
    if (!enabled) return
    const k = 1 - Math.pow(1 - 1 / 6, delta / 16.7)
    x.set(x.get() + (target.current.x - x.get()) * k)
    y.set(y.get() + (target.current.y - y.get()) * k)
  })

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] h-10 w-10 rounded-full bg-white mix-blend-difference"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{ scale: hidden ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    />
  )
}
