# Abhishek Kumar — Portfolio

Personal portfolio and resume site for Abhishek Kumar, automation tester and
Quality Engineer (Tricentis Tosca). Live at
https://abhi23raj472.github.io/Abhishek-Kumar/

The site is a single static page: `index.html` holds the markup, styles and the
small menu script. Vite builds it and GitHub Actions deploys it to GitHub Pages
on every push to `main`.

## Sections

- **Intro**: name, one-line pitch and current role.
- **Story**: about, what I own on a release, and a 2021–2026 timeline.
- **Stack**: 38 tools grouped by area, with signal bars for proficiency.
- **Work**: six headline results.
- **Experience**: Optum Global Solutions and Expleo Group.
- **Recognition**: four awards and twelve certifications.
- **Contact**: email, LinkedIn and resume.

## Run it locally

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## Editing

- Text and layout: `index.html`.
- Photo: `public/portrait.jpg`.
- Resume: `public/Abhishek_Kumar_Resume.pdf`.
- Accent colour: the `--acc` value on the root element in `index.html`.

Scroll-linked animations use CSS scroll-driven animations. Browsers without
support, and visitors with reduced motion turned on, see the same page without
the motion.
