import { motion, useScroll, useTransform } from 'framer-motion'

// Slow-moving colour fields fixed behind the page. Glass needs something
// colourful behind it to read as glass. Two palettes cross-fade as you scroll
// (opacity only, so it stays cheap for the GPU).
const cool = [
  { c: 'bg-pass/30', s: 'h-[46rem] w-[46rem]', p: 'left-[-12rem] top-[-10rem]', a: { x: [0, 120, 0], y: [0, 80, 0] }, d: 26 },
  { c: 'bg-cyan/25', s: 'h-[40rem] w-[40rem]', p: 'right-[-14rem] top-[8rem]', a: { x: [0, -100, 0], y: [0, 120, 0] }, d: 30 },
  { c: 'bg-violet/25', s: 'h-[38rem] w-[38rem]', p: 'left-[25%] bottom-[-16rem]', a: { x: [0, 90, -60, 0], y: [0, -80, 0] }, d: 34 },
]
const warm = [
  { c: 'bg-violet/30', s: 'h-[44rem] w-[44rem]', p: 'right-[-10rem] top-[-8rem]', a: { x: [0, -90, 0], y: [0, 100, 0] }, d: 28 },
  { c: 'bg-[#f472b6]/20', s: 'h-[36rem] w-[36rem]', p: 'left-[-10rem] bottom-[-6rem]', a: { x: [0, 110, 0], y: [0, -70, 0] }, d: 32 },
  { c: 'bg-cyan/20', s: 'h-[34rem] w-[34rem]', p: 'left-[35%] top-[20%]', a: { x: [0, -70, 50, 0], y: [0, 60, 0] }, d: 36 },
]

function Layer({ blobs, style }) {
  return (
    <motion.div className="absolute inset-0" style={style}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[110px] will-change-transform ${b.c} ${b.s} ${b.p}`}
          animate={b.a}
          transition={{ repeat: Infinity, duration: b.d, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}

export default function Aurora() {
  const { scrollYProgress } = useScroll()
  const warmOpacity = useTransform(scrollYProgress, [0.15, 0.6], [0, 1])
  const coolOpacity = useTransform(scrollYProgress, [0.15, 0.6, 0.95], [1, 0.35, 0.8])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <Layer blobs={cool} style={{ opacity: coolOpacity }} />
      <Layer blobs={warm} style={{ opacity: warmOpacity }} />
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="grain absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,8,10,0.75)_100%)]" />
    </div>
  )
}
