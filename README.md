# Abhishek Kumar — Portfolio

Personal portfolio and resume site for Abhishek Kumar, Quality Engineer
(Tricentis Tosca). Live at https://abhi23raj472.github.io/Abhishek-Kumar/

The design is a set of engineering "sheets" in Ricotta cream and Prussian blue,
with 3D, interactive pieces in each section.

## Sections

- **Hero**: name, pitch and an isometric mini-city you can tilt and hover.
- **Results**: a test report whose checks pass as you scroll to it.
- **About**: a lanyard ID badge with the photo.
- **Tools**: a drawer cabinet of tools in four groups.
- **Work**: a timeline of Optum and Expleo; pick a role to open its card.
- **Certifications**: a passport you open and page through, one certificate per page.
- **Awards**: a medal wall; medals swing with the mouse and flip on click.
- **Contact**: a rotary telephone; dial email, LinkedIn, CV or location.

## Run it locally

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/ (pre-rendered HTML)
```

## How it is built

- `index.html`: page shell, search and link-preview tags.
- `src/App.js`: the whole page as one Preact component (markup in an `htm`
  template, plus the interaction logic).
- `src/design.css`: the design styles and the responsive rules.
- `src/site.css`: site-wide rules (smooth scrolling, anchor offsets).
- `scripts/prerender.mjs`: renders the page to HTML at build time, so it shows
  before the script loads and search engines can read it.
- Photo: `public/portrait-blueprint.jpg`. Resume: `public/Abhishek_Kumar_Resume.pdf`.

GitHub Actions builds and deploys to GitHub Pages on every push to `main`.
Visitors with reduced motion turned on see the same page without the motion.
