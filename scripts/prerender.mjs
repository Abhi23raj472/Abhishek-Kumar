// Renders the page to HTML at build time so it shows (and is indexed) before the script loads.
// The browser then hydrates this markup instead of building it from scratch.
import { readFileSync, writeFileSync } from 'node:fs';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { App } from '../src/App.js';

const file = new URL('../dist/index.html', import.meta.url);
const page = readFileSync(file, 'utf8');
if (!page.includes('<!--app-->')) throw new Error('dist/index.html has no <!--app--> placeholder');
writeFileSync(file, page.replace('<!--app-->', render(h(App))));
console.log('prerendered dist/index.html');
