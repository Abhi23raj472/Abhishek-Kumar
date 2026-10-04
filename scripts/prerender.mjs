// Injects the server-rendered page into dist/index.html after `vite build`.
// The browser still starts the app normally; this only makes the content
// readable to crawlers and social previews before JavaScript runs.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const ssrEntry = resolve('dist-ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssrEntry).href)
const html = render()

const indexPath = resolve('dist/index.html')
const template = await readFile(indexPath, 'utf8')
const slot = '<div id="root"></div>'
if (!template.includes(slot)) throw new Error(`prerender: ${slot} not found in dist/index.html`)
await writeFile(indexPath, template.replace(slot, `<div id="root">${html}</div>`))
await rm(resolve('dist-ssr'), { recursive: true, force: true })

console.log(`prerender: wrote ${(html.length / 1024).toFixed(1)} KB of HTML into dist/index.html`)
