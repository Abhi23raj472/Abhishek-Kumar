# Abhishek Kumar — Portfolio

Personal portfolio built with React, Vite, Tailwind CSS and Framer Motion.

A clean, minimal design (Inter, near-monochrome palette with one muted accent) with scroll-driven Framer Motion effects:

- **Intro**: a short "test run" preloader (once per session), then the name rises in letter by letter.
- **Hero**: cursor-following glow, name lines that split apart on scroll, a rotating role ticker and a circular badge that spins with the scroll.
- **Velocity marquee**: tool names that speed up, reverse and skew with scroll speed and direction.
- **About**: a paragraph whose words light up as you scroll through it, plus count-up stats.
- **What I do**: a pinned section where vertical scrolling slides the cards sideways.
- **Experience**: a timeline whose spine draws itself as you scroll.
- **Impact**: cards that pin and stack on top of each other.
- **Skills, GitHub, Awards, Contact**: animated bars, live contribution graph, expanding award rows and a scaling footer headline.

The light/dark theme follows the system until toggled, and is remembered. With reduced motion turned on, scroll-linked effects and the intro are switched off and the pinned sections fall back to plain layouts.

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

All text content lives in `src/data.js`. Each section is a component in `src/sections/`, shared animation helpers are in `src/lib/motion.jsx`, and theme colours are CSS variables at the top of `src/index.css`.
Replace `public/Abhishek_Kumar_Resume.pdf` to update the resume download.

## GitHub Pages

The existing workflow publishes pushes to `main` using GitHub Actions. Vite's relative base and resume links support the `/Abhishek-Kumar/` path.
