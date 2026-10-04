import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../data'
import { Counter, SectionHead, Stagger, StaggerItem } from '../lib/motion'

const API = 'https://api.github.com'
const CONTRIB = 'https://github-contributions-api.jogruber.de/v4/'
const levels = ['bg-fg/[0.07]', 'bg-accent/30', 'bg-accent/55', 'bg-accent/80', 'bg-accent']
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
    <section id="github" className="shell py-24 md:py-40">
      <SectionHead
        index="06"
        kicker="GitHub"
        title="Building in the open."
        highlight={['open.']}
        sub={
          <>
            Live from{' '}
            <a className="text-fg underline decoration-accent underline-offset-4" href={profile.github} target="_blank" rel="noopener noreferrer">
              @{user}
            </a>{' '}
            — refreshed on every visit.
          </>
        }
      />

      <Stagger className="grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
        {tiles.map((t) => (
          <StaggerItem key={t.k} className="border-b border-r border-line p-6 md:p-8">
            <div className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.04em]">
              <Counter to={t.v ?? null} />
            </div>
            <div className="mt-3 text-sm text-mute">{t.k}</div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-6 rounded-[1.5rem] border border-line bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Contribution graph</span>
          {!!years.length && (
            <div className="flex flex-wrap gap-1 rounded-full border border-line p-1">
              {[{ y: 'last', t: 'last 12 mo' }, ...years.map((y) => ({ y, t: y }))].map((b) => (
                <button
                  key={b.y}
                  type="button"
                  onClick={() => setYear(b.y)}
                  aria-pressed={year === b.y}
                  className={`relative rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${year === b.y ? 'text-on-lime' : 'text-mute hover:text-fg'}`}
                >
                  {year === b.y && (
                    <motion.span layoutId="gh-year" className="absolute inset-0 rounded-full bg-lime" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{b.t}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          {failed ? (
            <p className="py-10 text-center text-mute">
              Contribution graph unavailable right now. See{' '}
              <a className="text-fg underline" href={profile.github} target="_blank" rel="noopener noreferrer">
                github.com/{user}
              </a>
              .
            </p>
          ) : !data ? (
            <div className="grid h-[118px] place-items-center font-mono text-sm text-mute">
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
                      className={`h-[13px] w-[13px] rounded-[3px] ${levels[d.level]}`}
                    />
                  ) : (
                    <span key={`p${i}`} className="h-[13px] w-[13px]" />
                  ),
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {data && days.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-mute">
            <span>
              <span className="text-fg">{total.toLocaleString()}</span> contributions · {fmt(days[0].date)} → {fmt(days[days.length - 1].date)}
            </span>
            <span className="flex items-center gap-1.5">
              less {levels.map((l) => <span key={l} className={`h-[11px] w-[11px] rounded-[3px] ${l}`} />)} more
            </span>
          </div>
        )}
      </div>

      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 inline-flex items-center gap-2 font-semibold"
      >
        View profile on GitHub
        <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </section>
  )
}
