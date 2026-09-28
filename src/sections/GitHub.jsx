import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data'
import { Counter, SectionHead, Spotlight, Stagger, StaggerItem } from '../components/motion'

const API = 'https://api.github.com'
const CONTRIB = 'https://github-contributions-api.jogruber.de/v4/'
const levels = ['bg-tint/[0.05]', 'bg-pass/25', 'bg-pass/45', 'bg-pass/70', 'bg-pass']

const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export default function GitHub() {
  const user = profile.githubUser
  const [u, setU] = useState(null)
  const [stars, setStars] = useState(null)
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [year, setYear] = useState('last')

  useEffect(() => {
    fetch(`${API}/users/${user}`).then((r) => (r.ok ? r.json() : Promise.reject())).then(setU).catch(() => {})
    fetch(`${API}/users/${user}/repos?per_page=100&sort=pushed`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rs) => setStars(rs.filter((r) => !r.fork).reduce((a, r) => a + r.stargazers_count, 0)))
      .catch(() => {})
    fetch(`${CONTRIB}${user}?y=all`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setFailed(true))
  }, [user])

  const years = useMemo(
    () => (data ? Object.keys(data.total || {}).filter((k) => /^\d{4}$/.test(k)).sort((a, b) => b - a).slice(0, 4) : []),
    [data],
  )

  const days = useMemo(() => {
    if (!data) return []
    const now = Date.now()
    const cutoff = now - 364 * 864e5
    return data.contributions.filter((d) => {
      const t = new Date(d.date + 'T00:00:00').getTime()
      return year === 'last' ? t >= cutoff && t <= now : d.date.slice(0, 4) === year
    })
  }, [data, year])

  const lastYearTotal = useMemo(() => {
    if (!data) return null
    const now = Date.now()
    const cutoff = now - 364 * 864e5
    return data.contributions.reduce((a, d) => {
      const t = new Date(d.date + 'T00:00:00').getTime()
      return t >= cutoff && t <= now ? a + d.count : a
    }, 0)
  }, [data])

  const total = days.reduce((a, d) => a + d.count, 0)
  const pad = days.length ? new Date(days[0].date + 'T00:00:00').getDay() : 0
  const cells = [...Array(pad).fill(null), ...days]

  const tiles = [
    { k: 'public repos', v: u?.public_repos },
    { k: 'contributions (1y)', v: lastYearTotal },
    { k: 'total stars', v: stars },
    { k: 'followers', v: u?.followers },
  ]

  return (
    <section id="github" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHead
        index="05"
        kicker="GitHub"
        title={<>Open-source <span className="text-gradient">activity</span>.</>}
        sub={<>Live from <a className="text-fg underline decoration-pass/50 underline-offset-4 hover:decoration-pass" href={profile.github} target="_blank" rel="noopener noreferrer">@{user}</a> — refreshed on every visit.</>}
      />

      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((t) => (
          <StaggerItem key={t.k}>
            <Spotlight tilt={12} className="p-6">
              <div className="font-display text-4xl font-semibold text-fg">
                <Counter to={t.v ?? null} />
              </div>
              <div className="mt-1 font-mono text-xs text-mute">{t.k}</div>
            </Spotlight>
          </StaggerItem>
        ))}
      </Stagger>

      <Spotlight tilt={3} className="mt-4 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Contribution graph</div>
          {!!years.length && (
            <div className="flex flex-wrap gap-1 rounded-xl border border-line p-1">
              {[{ y: 'last', t: 'last 12 mo' }, ...years.map((y) => ({ y, t: y }))].map((b) => (
                <button
                  key={b.y}
                  onClick={() => setYear(b.y)}
                  className={`relative rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${year === b.y ? 'text-onaccent' : 'text-mute hover:text-fg'}`}
                >
                  {year === b.y && (
                    <motion.span layoutId="yr" className="absolute inset-0 -z-0 rounded-lg bg-pass" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{b.t}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          {failed ? (
            <p className="py-10 text-center">
              Contribution graph unavailable right now. See{' '}
              <a className="text-fg underline" href={profile.github} target="_blank" rel="noopener noreferrer">github.com/{user}</a>.
            </p>
          ) : !data ? (
            <div className="grid h-[118px] place-items-center font-mono text-sm text-mute">
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                loading contribution activity…
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
                      animate={{ scale: 1 }}
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
      </Spotlight>
    </section>
  )
}
