# Abhishek Kumar — Portfolio

Personal portfolio built with React, Vite, Tailwind CSS and Framer Motion.

The design uses frosted glass panels, a light default theme, a persistent light/dark toggle, scroll reveals, parallax, magnetic buttons and subtle card tilt. Reduced-motion preferences are respected.

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

The portfolio content and animations live in `src/App.jsx`; styling and light/dark theme variables live in `src/index.css`.
Replace `public/Abhishek_Kumar_Resume.pdf` to update the resume download.

## GitHub Pages

The existing workflow publishes pushes to `main` using GitHub Actions. Vite's relative base and resume links support the `/Abhishek-Kumar/` path.
The redesign branch can be reviewed and merged before publishing to the existing GitHub Pages site.
