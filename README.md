# Abhishek Kumar — Portfolio

Personal portfolio built with React, Vite, Tailwind CSS, Framer Motion and Lenis.

The site is written up as a quality inspection record, the document a QA engineer signs off:

- **Title block**: the name in expanded capitals, a title block with role, organisation and specialty, a result summary, and a rubber stamp in ultramarine ink that lands with a thud on load.
- **§ 1.0 Summary**: key words get a reviewer's highlighter as the paragraph scrolls past.
- **§ 2.0 Scope**: a checklist; each box ticks itself as its row comes into view.
- **§ 3.0 Findings**: each result is re-run as you scroll: queued, running, then PASS, with a live pass count.
- **§ 4.0 Record**: the roles as a revision history, with a timeline that fills as you read.
- **§ 5.0 Skills**: the latest additions first, a radar of core skills with a sweep line, and every skill by area.
- **§ 6.0 Certified**: certificates as status shields, and the awards.
- **§ 7.0 Contact**: email with a copy button and a sign-off block.
- **Throughout**: Lenis smooth scrolling, section headings that slide up out of a mask, and a scroll progress line under the header.

Fonts: Archivo (its width axis gives the expanded display face) and IBM Plex Mono.

The page follows the system light/dark setting until the visitor picks one with the button in the top bar, which is remembered. With reduced motion turned on, animations and smooth scrolling are off and everything shows in its final state.

## Run locally

```bash
npm ci
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Edit content

All text content lives in `src/data.js`. Each section is a component in `src/sections/`, the header is `src/components/Nav.jsx`, shared animation helpers (including the numbered `Section` frame) are in `src/lib/motion.jsx`, and theme colours are CSS variables at the top of `src/index.css`. Skills added most recently are the `latest` list in `src/data.js`.
Replace `public/Abhishek_Kumar_Resume.pdf` to update the resume download.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes every push to `main`. Vite's relative base and resume links support the `/Abhishek-Kumar/` path.
Set **Settings → Pages → Source** to **GitHub Actions** so only this workflow publishes the site.
