import { motion, useReducedMotion } from 'framer-motion'
import { doing } from '../data'
import { SectionHead, Stagger, StaggerItem } from '../lib/motion'

// One world per area of work: band colours, size, glow and an optional ring.
const worlds = [
  { bands: ['#173a73', '#2f68b8', '#5c95dc', '#2a5aa3'], size: 132, glow: 'rgb(80 140 255 / 0.35)' },
  { bands: ['#8a6a46', '#d8c19a', '#b49468', '#e8d8b6'], size: 118, glow: 'rgb(242 194 123 / 0.3)', ring: '#d9c6a0' },
  { bands: ['#5b2a1f', '#9a4a31', '#7a3a27', '#b8613f'], size: 104, glow: 'rgb(220 110 80 / 0.28)' },
  { bands: ['#6f93b4', '#c9def0', '#9dbad3', '#e6f1fa'], size: 112, glow: 'rgb(170 210 255 / 0.3)', ring: '#b9d3ec' },
]

function Ring({ color, front }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-1/2 h-[34%] w-[170%] -translate-x-1/2 -translate-y-1/2 -rotate-[16deg] rounded-[50%] border-[3px]"
      style={{
        borderColor: color,
        opacity: 0.7,
        zIndex: front ? 2 : 0,
        clipPath: front ? 'inset(50% 0 0 0)' : 'inset(0 0 50% 0)',
        boxShadow: `0 0 0 4px ${color}22`,
      }}
    />
  )
}

function Planet({ w }) {
  const [a, b, c, d] = w.bands
  return (
    <div className="relative" style={{ width: w.size, height: w.size }}>
      {w.ring && <Ring color={w.ring} />}
      <div
        className="relative z-[1] h-full w-full overflow-hidden rounded-full"
        style={{ boxShadow: `0 0 60px ${w.glow}` }}
      >
        <div
          className="planet-surface absolute inset-0"
          style={{
            backgroundImage: [
              'radial-gradient(ellipse 14% 9% at 30% 62%, rgb(255 255 255 / 0.22), transparent 70%)',
              'radial-gradient(ellipse 10% 6% at 75% 35%, rgb(0 0 0 / 0.25), transparent 70%)',
              `repeating-linear-gradient(176deg, ${a} 0 9%, ${b} 9% 15%, ${c} 15% 24%, ${d} 24% 31%, ${a} 31% 38%)`,
            ].join(','),
            backgroundSize: '50% 100%, 50% 100%, 100% 100%',
          }}
        />
        {/* Lit from the upper left, falling into night on the lower right. */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 28%, rgb(255 255 255 / 0.22), transparent 38%), radial-gradient(circle at 78% 80%, rgb(0 0 0 / 0.92), transparent 68%)',
            boxShadow: 'inset -14px -12px 34px rgb(0 0 0 / 0.85), inset 2px 2px 6px rgb(255 255 255 / 0.12)',
          }}
        />
      </div>
      {w.ring && <Ring color={w.ring} front />}
    </div>
  )
}

export default function Work() {
  const reduce = useReducedMotion()
  return (
    <section id="work" className="shell py-24 md:py-36">
      <SectionHead
        index="02"
        kicker="What I do"
        title="Four worlds I keep in orbit."
        highlight={['orbit.']}
        sub="The areas I own on a release, from building suites to closing out defects."
      />

      <Stagger className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" gap={0.12}>
        {doing.map((d, i) => {
          const w = worlds[i % worlds.length]
          return (
            <StaggerItem key={d.code} className="group flex flex-col items-center text-center" data-cursor>
              <motion.div
                className="grid h-44 place-items-center"
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="transition-transform duration-500 group-hover:scale-110">
                  <Planet w={w} />
                </div>
              </motion.div>
              <p className="label mt-4">{d.code}</p>
              <h3 className="mt-2 font-display text-2xl">{d.title}</h3>
              <span aria-hidden className="my-4 h-6 w-px origin-top scale-y-50 bg-line transition-transform duration-500 group-hover:scale-y-100 group-hover:bg-accent" />
              <p className="max-w-[17rem] text-sm leading-relaxed text-mute transition-colors group-hover:text-fg">{d.body}</p>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
