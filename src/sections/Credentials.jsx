import { motion } from 'framer-motion'
import { awards, certs } from '../data'
import { Check, Reveal, Section, Stagger, StaggerItem } from '../lib/motion'

const pop = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 22 } },
}

export default function Credentials() {
  const count = certs.reduce((n, c) => n + c.items.length, 0)
  return (
    <Section
      id="credentials"
      no="6.0"
      label="Certified"
      title="Certified and recognised."
      intro={`${count} certifications across Tricentis, ISTQB, Optum.ai and Allianz, and four awards for delivery.`}
    >
      {/* certificates, shown as status shields */}
      <div className="grid gap-8 md:grid-cols-2">
        {certs.map((c) => (
          <div key={c.org} className="min-w-0">
            <Reveal className="flex items-baseline justify-between gap-4 border-b border-ink pb-2">
              <h3 className="font-bold" style={{ fontStretch: '112%' }}>
                {c.org}
              </h3>
              <span className="figure font-mono text-[12px] text-ink-2">
                {c.items.length} {c.items.length === 1 ? 'certificate' : 'certificates'}
              </span>
            </Reveal>
            <Stagger as="ul" gap={0.05} className="mt-4 flex flex-wrap gap-2">
              {c.items.map((it) => (
                <StaggerItem as="li" key={it} variants={pop} className="max-w-full">
                  <span className="shield max-w-full">
                    <span className="grid place-items-center">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="whitespace-normal">{it}</span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}
      </div>

      {/* awards */}
      <div className="mt-16">
        <p className="label">Awards</p>
        <ol className="mt-3 border-t border-ink">
          {awards.map((a, i) => (
            <motion.li
              key={a.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="grid gap-x-8 gap-y-1.5 border-b border-rule py-5 md:grid-cols-[110px_minmax(0,280px)_minmax(0,1fr)] md:items-baseline md:px-3"
            >
              <span className="figure font-mono text-[13px] text-ink-2">{a.date}</span>
              <h3 className="text-[19px] font-bold leading-tight" style={{ fontStretch: '112%' }}>
                {a.name}
                {a.by && <span className="mt-1 block text-[14px] font-medium text-stamp">{a.by}</span>}
              </h3>
              <p className="max-w-[58ch] text-ink-2">{a.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
