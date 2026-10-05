// Injects the server-rendered page into dist/index.html after `vite build`.
// The browser still starts the app normally; this only makes the content
// readable to crawlers and social previews before JavaScript runs.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const ssrEntry = resolve('dist-ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssrEntry).href)
// Framer Motion renders each element's animation start state inline
// (opacity:0 plus an offset). Visitors see this HTML until JavaScript loads,
// so un-hide it here: the page reads as finished instead of blank.
const unhide = (markup) =>
  markup.replace(/style="([^"]*)"/g, (whole, css) => {
    const decls = css.split(';').filter(Boolean)
    if (!decls.some((d) => /^opacity:0(\.0+)?$/.test(d.trim()))) return whole
    const kept = decls.filter((d) => !/^(opacity|transform|filter):/.test(d.trim()))
    return kept.length ? `style="${kept.join(';')}"` : ''
  })
const html = unhide(render())

const indexPath = resolve('dist/index.html')
const template = await readFile(indexPath, 'utf8')
const slot = '<div id="root"></div>'
if (!template.includes(slot)) throw new Error(`prerender: ${slot} not found in dist/index.html`)
await writeFile(indexPath, template.replace(slot, `<div id="root">${html}</div>`))
await rm(resolve('dist-ssr'), { recursive: true, force: true })

console.log(`prerender: wrote ${(html.length / 1024).toFixed(1)} KB of HTML into dist/index.html`)
