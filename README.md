# Abhishek Kumar World

An interactive 3D portfolio. Visitors drive a toy car around a sunny world, smash through the 3D name, knock over the certification crate tower and bowling pins, jump ramps, and open six zones: About, Experience, Skills, Certifications, Awards and Contact. A **Classic view** shows all the content as a normal readable page.

Works on desktop (keyboard) and phones (joystick + Gas/Brake buttons), in portrait and landscape.

## Files

```
abhishek-portfolio-world/
├── index.html      Page structure, HUD, intro and classic view
├── css/style.css   All styling (desktop, phone portrait, phone landscape)
└── js/main.js      3D world, physics, car, zones, controls
```

No build step and no npm install. The page loads two libraries from a CDN:

- Three.js r128 (3D rendering)
- Cannon.js 0.6.2 (physics)

## Run it locally

Open the folder in VS Code and use the **Live Server** extension, or run:

```bash
cd abhishek-portfolio-world
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy on GitHub Pages

1. Copy `index.html`, `css/` and `js/` into your repository (the root, or a folder such as `world/`).
2. Commit and push to `main`.
3. In the repository, go to **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. After a minute the site is live at `https://<username>.github.io/<repo>/` (add `world/` if you used a folder).

Tip: before replacing your current site, create a backup branch first: `git checkout -b backup/before-3d-world && git push origin backup/before-3d-world`.

## Edit the content

Everything shown in the zones lives in the `ZONES` array at the top of `js/main.js`. Each zone has:

- `name` and `color`: label and colour of the zone
- `x`, `z`: position in the world
- `icon`: the floating icon (`person`, `case`, `gear`, `gem`, `star`, `mail`)
- `html`: the text shown in the info card and the classic view

**Before publishing, fill in the placeholders in the Contact zone:** `[your email]`, `[your LinkedIn URL]` and `[résumé link]`.

The certification crates use the `CRATES` array right below `ZONES`.

## Controls

| Desktop | Phone |
| --- | --- |
| W A S D or arrow keys: drive | Joystick: steer (push up to drive, pull down to reverse) |
| Space: brake | Gas / Brake buttons |
| R: flip the car back | Flip button |
| Mouse wheel: zoom | Pinch: zoom |
| Click the minimap: jump to a zone | Tap the minimap: jump to a zone |
