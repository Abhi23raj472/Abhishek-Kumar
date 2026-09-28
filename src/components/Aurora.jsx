import { motion, useScroll, useTransform } from 'framer-motion'

// Colour fields fixed behind the page, so the glass has something to show.
// Built from soft radial gradients (no CSS blur filter, which is very costly
// to repaint). The two palettes cross-fade as you scroll.
const cool = [
  'radial-gradient(40% 38% at 18% 18%, rgb(52 211 153 / 0.42), transparent 72%)',
  'radial-gradient(34% 34% at 86% 30%, rgb(34 211 238 / 0.34), transparent 72%)',
  'radial-gradient(38% 36% at 48% 92%, rgb(167 139 250 / 0.34), transparent 72%)',
].join(',')
const warm = [
  'radial-gradient(40% 38% at 84% 14%, rgb(167 139 250 / 0.42), transparent 72%)',
  'radial-gradient(34% 34% at 12% 80%, rgb(244 114 182 / 0.28), transparent 72%)',
  'radial-gradient(34% 32% at 50% 45%, rgb(34 211 238 / 0.26), transparent 72%)',
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,8,10,0.75)_100%)]" />
    </div>
  )
}
