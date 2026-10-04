import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../data'
import { Counter, SectionHead, Stagger, StaggerItem } from '../lib/motion'

const API = 'https://api.github.com'
const CONTRIB = 'https://github-contributions-api.jogruber.de/v4/'
const levels = ['bg-fg/[0.06]', 'bg-fg/25', 'bg-fg/45', 'bg-fg/70', 'bg-fg']
const DAY = 864e5

const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const inLastYear = (d) => {
  const t = new Date(d.date + 'T00:00:00').getTime()
  return t >= Date.now() - 364 * DAY && t <= Date.now()
}

export default function GitHub() {
  const user = profile.githubUser
  const [u, setU] = useState(null)
  const [stars, setStars] = useState(null)
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [year, setYear] = useState('last')

  useEffect(() => {
    // Live data first; if a request is blocked or rate-limited, fall back to
    // the snapshot the deploy workflow saves daily into public/github-data/.
    const get = (live, snap) =>
      fetch(live)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .catch(() => fetch(snap).then((r) => (r.ok ? r.json() : Promise.reject())))

    get(`${API}/users/${user}`, './github-data/user.json').then(setU).catch(() => {})
    get(`${API}/users/${user}/repos?per_page=100&sort=pushed`, './github-data/repos.json')
      .then((rs) => setStars(rs.filter((r) => !r.fork).reduce((a, r) => a + r.stargazers_count, 0)))
      .catch(() => {})
    get(`${CONTRIB}${user}?y=all`, './github-data/contributions.json')
      .then(setData)
      .catch(() => setFailed(true))
  }, [user])

  const years = useMemo(
    () => (data ? Object.keys(data.total || {}).filter((k) => /^\d{4}$/.test(k)).sort((a, b) => b - a).slice(0, 4) : []),
    [data],
  )
  const days = useMemo(
    () => (data ? data.contributions.filter((d) => (year === 'last' ? inLastYear(d) : d.date.slice(0, 4) === year)) : []),
    [data, year],
  )
  const lastYearTotal = useMemo(
    () => (data ? data.contributions.filter(inLastYear).reduce((a, d) => a + d.count, 0) : null),
    [data],
  )

  const total = days.reduce((a, d) => a + d.count, 0)
  const pad = days.length ? new Date(days[0].date + 'T00:00:00').getDay() : 0
  const cells = [...Array(pad).fill(null), ...days]

  const tiles = [
    { k: 'public repos', v: u?.public_repos },
    { k: 'contributions, last 12 mo', v: lastYearTotal },
    { k: 'stars earned', v: stars },
    { k: 'followers', v: u?.followers },
  ]

  return (
    <section id="github" className="shell py-24 md:py-32">
      <SectionHead
        index="06"
        kicker="GitHub"
        title="Building in the open."
        highlight={['in', 'the', 'open.']}
        sub={
          <>
            Live from{' '}
            <a className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg" href={profile.github} target="_blank" rel="noopener noreferrer">
              @{user}
            </a>
            , refreshed on every visit.
          </>
        }
      />

      <Stagger className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
        {tiles.map((t) => (
          <StaggerItem key={t.k} className="border-b border-r border-line p-5 md:p-6">
            <div className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-semibold leading-none tracking-[-0.03em]">
              <Counter to={t.v ?? null} />
            </div>
            <div className="mt-2 text-[13px] text-mute">{t.k}</div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">Contribution graph</span>
          {!!years.length && (
            <div className="flex flex-wrap gap-1 rounded-full border border-line p-1">
              {[{ y: 'last', t: 'last 12 mo' }, ...years.map((y) => ({ y, t: y }))].map((b) => (
                <button
                  key={b.y}
                  type="button"
                  onClick={() => setYear(b.y)}
                  aria-pressed={year === b.y}
                  className={`relative rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${year === b.y ? 'text-on-ink' : 'text-mute hover:text-fg'}`}
                >
                  {year === b.y && (
                    <motion.span layoutId="gh-year" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{b.t}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          {failed ? (
            <p className="py-10 text-center text-sm text-mute">
              Contribution graph unavailable right now. See{' '}
              <a className="text-fg underline" href={profile.github} target="_blank" rel="noopener noreferrer">
                github.com/{user}
              </a>
              .
            </p>
          ) : !data ? (
            <div className="grid h-[110px] place-items-center font-mono text-xs text-mute">
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                fetching contribution activity…
              </motion.span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={year}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
              >
                {cells.map((d, i) =>
                  d ? (
                    <motion.span
                      key={d.date}
                      title={`${d.count} contribution${d.count === 1 ? '' : 's'} on ${fmt(d.date)}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.floor(i / 7) * 0.012, duration: 0.25 }}
                      className={`h-3 w-3 rounded-[3px] ${levels[d.level]}`}
                    />
                  ) : (
                    <span key={`p${i}`} className="h-3 w-3" />
                  ),
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {data && days.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-mute">
            <span>
              <span className="text-fg">{total.toLocaleString()}</span> contributions · {fmt(days[0].date)} → {fmt(days[days.length - 1].date)}
            </span>
            <span className="flex items-center gap-1.5">
              less {levels.map((l) => <span key={l} className={`h-2.5 w-2.5 rounded-[3px] ${l}`} />)} more
            </span>
          </div>
        )}
      </div>

      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
        View profile on GitHub
        <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </section>
  )
}
