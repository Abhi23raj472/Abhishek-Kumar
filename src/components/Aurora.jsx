import { motion, useScroll, useTransform } from 'framer-motion'

// Colour fields fixed behind the page, so the glass has something to show.
// Built from soft radial gradients (no CSS blur filter, which is very costly
// to repaint). The two palettes cross-fade as you scroll.
const cool = [
  'radial-gradient(42% 40% at 14% 14%, rgb(110 231 183 / 0.55), transparent 72%)',
  'radial-gradient(38% 36% at 88% 24%, rgb(125 211 252 / 0.55), transparent 72%)',
  'radial-gradient(40% 38% at 50% 95%, rgb(196 181 253 / 0.50), transparent 72%)',
].join(',')
const warm = [
  'radial-gradient(42% 40% at 86% 12%, rgb(196 181 253 / 0.55), transparent 72%)',
  'radial-gradient(38% 36% at 10% 82%, rgb(253 186 116 / 0.35), transparent 72%)',
  'radial-gradient(36% 34% at 50% 45%, rgb(125 211 252 / 0.40), transparent 72%)',
].join(',')

// Static layers: a constantly drifting full-screen layer forces the whole
// page to be recomposited every frame, which is what made scrolling stutter.
function Layer({ bg, style }) {
  return <motion.div className="absolute inset-0" style={{ backgroundImage: bg, ...style }} />
}

export default function Aurora() {
  const { scrollYProgress } = useScroll()
  const warmOpacity = useTransform(scrollYProgress, [0.15, 0.6], [0, 1])
  const coolOpacity = useTransform(scrollYProgress, [0.15, 0.6, 0.95], [1, 0.4, 0.85])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <Layer bg={cool} style={{ opacity: coolOpacity }} />
      <Layer bg={warm} style={{ opacity: warmOpacity }} />
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
