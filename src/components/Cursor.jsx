import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/**
 * A thin ring that trails the mouse and swells over links and buttons.
 * The native cursor stays visible; this only renders for fine pointers.
 */
export default function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches && !reduce)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const over = (e) => setHovering(!!e.target.closest('a, button, [data-cursor]'))
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  // White + difference blending reads as an inverted ring on any background.
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-white mix-blend-difference"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: hovering ? 44 : 24,
        height: hovering ? 44 : 24,
        opacity: visible ? 0.9 : 0,
        backgroundColor: hovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    />
  )
}
