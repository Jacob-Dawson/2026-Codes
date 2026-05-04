# Topo Map

An interactive topographic map generator built with [p5.js](https://p5js.org/). Generate procedural island terrain and sculpt it by hand — placing peaks and depressions with a tap and hold.

---

## Features

- **Procedural terrain generation** — 7-octave fractal Brownian motion (fBm) Perlin noise with a radial island falloff, so every map is a self-contained landmass surrounded by ocean
- **Tap & hold sculpting** — press and hold anywhere on the canvas to place a Gaussian bump. The longer you hold, the taller the peak (or deeper the depression). A live arc indicator shows the current elevation percentage as you hold
- **Peak / Depression toggle** — switch between raising and lowering terrain before placing a mark
- **Adjustable brush size** — slider controls the spread radius (XS → XL) of each sculpted mark. Each mark remembers the brush size it was placed with, so changing the slider never affects existing terrain
- **Hillshading** — surface normals are computed from the height field gradient and lit from the north-west at ~45°, giving the terrain a three-dimensional appearance
- **Filled elevation bands** — 14 colour bands from deep ocean through to peak snow, rendered directly into a pixel buffer for performance
- **Contour lines** — band boundaries are darkened to form clean isoline edges. Every 500 m index contour is labelled slightly larger and bolder
- **Elevation labels** — contour lines are annotated with metre values (100 m – 1300 m), spaced so they never crowd each other
- **Undo** — removes the last placed mark and recomputes the field
- **Export** — saves the current canvas as a PNG download
- **Mobile friendly** — touch events are scoped to the canvas only, so UI buttons remain tappable on all devices

---

## Future Features

- **Animated water level** — a sine-wave driven sea level that slowly rises and falls, flooding valleys and exposing peaks. Very visually striking and shows off the height field data in a dynamic way
- **Drag to paint ridges** — instead of discrete tap-and-release marks, holding and dragging continuously places Gaussians along the path, so you can sculpt mountain ranges in one stroke
- **Named index contours** — every 5th contour line drawn thicker with a bolder label (standard topo convention, already partially there with isIndex but the line weight isn't differentiated yet)
- **Seed display + restore** — show the current noise seed as a number and let the user type one in to regenerate the exact same map, good for reproducibility
- **Simple erosion pass** — after generate, run a few iterations of thermal erosion (slope-based sediment sliding) to knock the sharp edges off peaks and make the terrain look naturally worn
- **Colour theme switcher** — toggle between the current green/brown topo palette, a greyscale relief style, and a bathymetric (blue-heavy ocean focus) style

---

## Controls

| Control | Action |
|---|---|
| **Generate** | Create a new random terrain |
| **Undo** | Remove the last placed mark |
| **Clear** | Wipe all terrain, return to blank ocean |
| **Export** | Download the current map as a PNG |
| **▲ Peak / ▼ Depression** | Toggle sculpt mode |
| **Brush slider** | Adjust the spread radius of the next mark |
| **Tap & hold on canvas** | Place a peak or depression |

---

## How it works

### Terrain generation
The base heightfield is a 160×120 grid of floats in `[0, 1]`. Each cell is sampled from 7 octaves of p5's Perlin noise (frequency doubling, amplitude halving each octave), then multiplied by a radial falloff centred on the canvas — this ensures the edges always taper to ocean regardless of the noise seed.

### Sculpting
Each placed mark is stored as `{ x, y, h, sign, sigma }`. When `computeField` runs it resets the field to the base terrain, then adds a Gaussian bump for every mark:

```
field[r][c] += sign × h × exp(-(dc² + dr²) / 2σ²)
```

Because `sigma` is frozen at placement time, existing marks are immune to later brush size changes.

### Rendering
Rendering only runs when `dirty = true`. The pipeline:
1. Assign each cell to one of 14 elevation bands
2. Compute a hillshade multiplier per cell from the height gradient (central differences) dotted with a normalised NW light vector
3. Write `band_colour × shade` into a pixel buffer via `loadPixels` / `updatePixels`
4. Darken pixels at cell boundaries where the band changes (contour lines)
5. Draw elevation labels using p5's graphics context on top

---

## Tech

- [p5.js](https://p5js.org/) `1.9.0` — rendering, noise, instance mode
- Vanilla HTML / CSS / JS — no build step required

---

## Structure

```
├── index.html
├── css/
│   └── base.css
└── js/
    └── index.js
```

---

## Running locally

No build step needed — just serve the files from a local static server. For example with [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), or:

```bash
npx serve .
```

Then open `http://localhost:3000`.