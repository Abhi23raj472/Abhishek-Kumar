import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../data'
import { Counter, Roll, SectionHead, Stagger, StaggerItem } from '../lib/motion'

const API = 'https://api.github.com'
const CONTRIB = 'https://github-contributions-api.jogruber.de/v4/'
const levels = ['bg-fg/[0.06]', 'bg-accent/25', 'bg-accent/45', 'bg-accent/70', 'bg-accent']
const DAY = 864e5

const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const inLastYear = (d) => {
  const t = new Date(d.date + 'T00:00:00').getTime()
  return t >= Date.now() - 364 * DAY && t <= Date.now()
}

// Empty days for the last 12 months: the calendar is drawn even before
// (or without) data, so the graph never collapses into a line of text.
function blankYear() {
  const days = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({ date: iso, count: 0, level: 0 })
  }
  return days
}

const CELL = 15 // 12px cell + 3px gap
const REFRESH = 10 * 60 * 1000 // re-check GitHub every 10 minutes while the page is open

// Live requests skip the browser cache so a revisit never shows yesterday's numbers.
const live = (url) => fetch(url, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
// The snapshot the deploy workflow saves into public/github-data/, used only when live fails.
const snapshot = (path) => fetch(path, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
const clock = (d) => d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

export default function GitHub() {
  const user = profile.githubUser
  const [u, setU] = useState(null)
  const [stars, setStars] = useState(null)
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [source, setSource] = useState(null) // 'live' | 'snapshot'
  const [updated, setUpdated] = useState(null)
  const [year, setYear] = useState('last')
  const lastLoad = useRef(0)

  useEffect(() => {
    let alive = true
    const countStars = (rs) => rs.filter((r) => !r.fork).reduce((a, r) => a + r.stargazers_count, 0)

    // Always try GitHub live. The deploy snapshot is only a first-load
    // fallback; a later failed refresh keeps whatever is already showing.
    const load = (first) => {
      lastLoad.current = Date.now()
      live(`${CONTRIB}${user}?y=all`)
        .then((d) => {
          if (!alive) return
          setData(d)
          setSource('live')
          setUpdated(new Date())
          setFailed(false)
        })
        .catch(() => {
          if (!first || !alive) return
          snapshot('./github-data/contributions.json')
            .then((d) => alive && (setData(d), setSource('snapshot')))
            .catch(() => alive && setFailed(true))
        })
      live(`${API}/users/${user}`)
        .then((d) => alive && setU(d))
        .catch(() => first && snapshot('./github-data/user.json').then((d) => alive && setU(d)).catch(() => {}))
      live(`${API}/users/${user}/repos?per_page=100&sort=pushed`)
        .then((rs) => alive && setStars(countStars(rs)))
        .catch(() => first && snapshot('./github-data/repos.json').then((rs) => alive && setStars(countStars(rs))).catch(() => {}))
    }

    load(true)
    const id = setInterval(() => !document.hidden && load(false), REFRESH)
    // Coming back to the tab after a while fetches fresh numbers straight away.
    const onVisible = () => !document.hidden && Date.now() - lastLoad.current > 2 * 60 * 1000 && load(false)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [user])

  const years = useMemo(
    () => (data ? Object.keys(data.total || {}).filter((k) => /^\d{4}$/.test(k)).sort((a, b) => b - a).slice(0, 4) : []),
    [data],
  )
  const days = useMemo(
    () => (data ? data.contributions.filter((d) => (year === 'last' ? inLastYear(d) : d.date.slice(0, 4) === year)) : blankYear()),
    [data, year],
  )
  const lastYearTotal = useMemo(
    () => (data ? data.contributions.filter(inLastYear).reduce((a, d) => a + d.count, 0) : null),
    [data],
  )

  const total = days.reduce((a, d) => a + d.count, 0)
  const pad = days.length ? new Date(days[0].date + 'T00:00:00').getDay() : 0
  const cells = [...Array(pad).fill(null), ...days]
  // Month labels sit above the column holding each month's first day.
  const months = []
  cells.forEach((d, i) => {
    if (d && d.date.endsWith('-01')) {
      months.push({ col: Math.floor(i / 7), label: new Date(d.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' }) })
    }
  })

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
        title="Transmissions from GitHub."
        highlight={['GitHub.']}
        sub={
          <>
            Live from{' '}
            <a className="text-fg underline decoration-line underline-offset-4 hover:decoration-fg" href={profile.github} target="_blank" rel="noopener noreferrer">
              @{user}
            </a>
            , refreshed live while you're on the page.
          </>
        }
      />

      <Stagger className="panel grid grid-cols-2 overflow-hidden rounded-2xl border-0 md:grid-cols-4">
        {tiles.map((t) => (
          <StaggerItem key={t.k} className="border border-line/60 p-5 md:p-6">
            <div className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-none">
              <Counter to={t.v ?? null} />
            </div>
            <div className="mt-2 text-[13px] text-mute">{t.k}</div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="panel mt-5 rounded-2xl p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
            Contribution graph
            {source === 'live' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-2 py-0.5 normal-case tracking-normal text-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                Live · updated {clock(updated)}
              </span>
            )}
            {source === 'snapshot' && (
              <span className="rounded-full border border-line px-2 py-0.5 normal-case tracking-normal">Snapshot from the last deploy</span>
            )}
          </span>
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
          <div className="relative w-max">
            <div aria-hidden className="relative mb-2 h-4 font-mono text-[10px] text-mute">
              {months.map((m) => (
                <span key={`${m.col}-${m.label}`} className="absolute" style={{ left: m.col * CELL }}>
                  {m.label}
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={data ? year : 'blank'}
                initial={{ opacity: 0 }}
                animate={data || failed ? { opacity: 1 } : { opacity: [0.35, 0.8, 0.35] }}
                // Own transition: the loading pulse repeats forever and must not apply to the exit.
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={data || failed ? { duration: 0.25 } : { duration: 1.6, repeat: Infinity }}
                className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
                aria-busy={!data && !failed}
              >
                {cells.map((d, i) =>
                  d ? (
                    <motion.span
                      key={d.date}
                      title={data ? `${d.count} contribution${d.count === 1 ? '' : 's'} on ${fmt(d.date)}` : fmt(d.date)}
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
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-mute">
          {data && days.length > 0 ? (
            <span>
              <span className="text-fg">{total.toLocaleString()}</span> contributions · {fmt(days[0].date)} → {fmt(days[days.length - 1].date)}
            </span>
          ) : failed ? (
            <span>
              Activity couldn't load here. Live counts are on{' '}
              <a className="text-fg underline" href={profile.github} target="_blank" rel="noopener noreferrer">
                github.com/{user}
              </a>
              .
            </span>
          ) : (
            <span>Fetching contribution activity…</span>
          )}
          <span className="flex items-center gap-1.5">
            less {levels.map((l) => <span key={l} className={`h-2.5 w-2.5 rounded-[3px] ${l}`} />)} more
          </span>
        </div>
      </div>

      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
        <Roll>View profile on GitHub</Roll>
        <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </section>
  )
}
