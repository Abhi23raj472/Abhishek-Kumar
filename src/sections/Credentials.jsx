import { Award, BadgeCheck } from 'lucide-react'
import { awards, certs } from '../data'
import { SectionHead, Stagger, StaggerItem } from '../lib/motion'

/** A mission patch: the award date runs round a ring that turns on hover. */
function Patch({ a, i }) {
  const id = `patch-${i}`
  return (
    <span className="relative grid h-20 w-20 shrink-0 place-items-center" aria-hidden>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full transition-transform duration-[2s] ease-out group-hover:rotate-[120deg]">
        <defs>
          <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="var(--accent)" strokeOpacity="0.5" />
        <circle cx="50" cy="50" r="30" fill="var(--surface-2)" stroke="var(--line)" />
        <text className="fill-mute font-mono text-[8.5px] uppercase" letterSpacing="1">
          <textPath href={`#${id}`} textLength="232" lengthAdjust="spacing">
            {`Award ✦ ${a.date} ✦ Award ✦ ${a.date} ✦ `}
          </textPath>
        </text>
      </svg>
      <Award size={22} className="relative text-accent" />
    </span>
  )
}

export default function Credentials() {
  return (
    <section id="credentials" className="shell py-24 md:py-32">
      <SectionHead index="06" kicker="Recognition" title="Commendations along the way." highlight={['along', 'the', 'way.']} />

      <Stagger className="grid gap-3 md:grid-cols-2" gap={0.1}>
        {awards.map((a, i) => (
          <StaggerItem
            key={a.name}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={`group panel flex gap-5 rounded-2xl p-5 md:p-6 ${i === 0 ? 'border-accent/40' : ''}`}
          >
            <Patch a={a} i={i} />
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
                {a.date}
                {a.by && <span className="text-accent"> · {a.by}</span>}
              </p>
              <h3 className="mt-1 font-display text-2xl leading-tight">{a.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-mute">{a.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-20">
        <h3 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          <BadgeCheck size={14} /> Certifications
        </h3>
        <Stagger className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" gap={0.1}>
          {certs.map((c) => (
            <StaggerItem
              key={c.org}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="panel flex flex-col rounded-2xl p-5"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xl">{c.org}</span>
                <span className="font-mono text-[11px] text-mute">×{c.items.length}</span>
              </div>
              <Stagger className="mt-4 flex flex-wrap gap-1.5" gap={0.05} delay={0.2}>
                {c.items.map((it) => (
                  <StaggerItem
                    key={it}
                    variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 20 } } }}
                    className="rounded-full bg-fg/[0.06] px-2.5 py-1 text-[13px]"
                  >
                    {it}
                  </StaggerItem>
                ))}
              </Stagger>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
