import { motion } from 'framer-motion'
import { doing, profile } from '../data'
import { Depth, SectionHead, Spotlight, Stagger, StaggerItem, item } from '../components/motion'

const facts = [
  ['base', profile.location],
  ['role', profile.role],
  ['stack', 'Tosca · API · SQL'],
  ['method', 'Scrum · Kanban'],
  ['status', 'Open to new roles'],
]

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead index="01" kicker="About" title={<>Automation, treated as a <span className="text-gradient">product</span>.</>} />

      <Stagger className="grid gap-4 md:grid-cols-6">
        <StaggerItem className="md:col-span-4">
          <Spotlight tilt={3} className="h-full p-7 md:p-9">
            <p className="text-lg leading-relaxed md:text-xl">
              I'm a <b className="text-fg">Quality Engineer</b> with five years across test automation, API validation and
              Agile QA. I specialise in <b className="text-fg">Tricentis Tosca</b> — reusable modules, data-driven design in
              TCD, and distributed execution through DEX.
            </p>
            <p className="mt-5 leading-relaxed">
              I care about automation that stays maintainable after the release it was written for: shared libraries,
              clean recovery scenarios, and CI/CD integration so every build ships with confidence.
            </p>
          </Spotlight>
        </StaggerItem>

        <StaggerItem className="md:col-span-2">
          <Spotlight className="h-full p-7">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-mute">profile.json</div>
            <dl className="mt-5 space-y-3 font-mono text-[13px]">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-tint/10 pb-3 last:border-0">
                  <dt className="text-mute">{k}</dt>
                  <dd className={k === 'status' ? 'text-pass' : 'text-fg'}>{v}</dd>
                </div>
              ))}
            </dl>
          </Spotlight>
        </StaggerItem>

        {doing.map((d, i) => (
          <motion.div key={d.code} variants={item} className={i < 2 ? 'md:col-span-3' : 'md:col-span-3'}>
            <Spotlight tilt={10} className="group h-full p-7" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-pass">{d.code}</span>
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-line text-mute transition-colors group-hover:border-pass/40 group-hover:text-pass">
                  ↗
                </span>
              </div>
              <Depth z={45}>
                <h3 className="mt-6 font-display text-2xl font-semibold text-fg">{d.title}</h3>
              </Depth>
              <Depth z={20}>
                <p className="mt-2 leading-relaxed">{d.body}</p>
              </Depth>
            </Spotlight>
          </motion.div>
        ))}
      </Stagger>
    </section>
  )
}
