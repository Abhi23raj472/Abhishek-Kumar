# Abhishek Kumar — Portfolio

Personal portfolio built with React, Vite, Tailwind CSS, Framer Motion, Lenis and three.js.

The site is a flight from Earth orbit into deep space:

- **Launch**: a short countdown (once per session), then the camera lifts off from Earth's limb into orbit.
- **Sky**: a three.js scene behind the page with a twinkling starfield, faint nebulae, a procedurally shaded Earth (clouds, city lights, atmosphere glow), planets that drift past the edges and the odd meteor. Scrolling flies the camera forward.
- **Hero**: the name fades up out of a blur with a satellite orbiting it; the focus line decodes from random glyphs.
- **About**: a porthole radar scope and a crew record that types itself out.
- **What I do**: each area of work is a small rotating planet.
- **Impact**: results arrive as downlink packets with live signal traces.
- **Experience**: a constellation; select a star to open that role's mission log.
- **Skills**: a draggable 3D sphere of tags with category filters, beside proficiency gauges.
- **GitHub, Awards, Contact**: live contribution graph, expanding award rows and certifications.
- **Throughout**: Lenis smooth scrolling, a targeting-reticle cursor that snaps onto links, and rolling link labels.

The three.js scene loads in its own chunk so the page renders straight away. With reduced motion turned on, the intro, flight, smooth scrolling and cursor are off and the sky holds a single still frame.

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

All text content lives in `src/data.js`. Each section is a component in `src/sections/`, the sky is `src/components/SpaceScene.jsx`, shared animation helpers are in `src/lib/motion.jsx`, and theme colours are CSS variables at the top of `src/index.css`.
Replace `public/Abhishek_Kumar_Resume.pdf` to update the resume download.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes every push to `main`. Vite's relative base and resume links support the `/Abhishek-Kumar/` path.
Set **Settings → Pages → Source** to **GitHub Actions** so only this workflow publishes the site.
