# Google Pixel 7a — Multi-Tech Drawing

A drawing of my current phone, the Google Pixel 7a, rendered four different ways using CSS, SVG, Canvas, and p5.js. The project is a visual exploration of how different web technologies approach the same drawing task.

## 🔗 Links

- **Live Demo:** _coming soon_
- **GitHub:** [github.com/Jacob-Dawson](https://github.com/Jacob-Dawson)

---

## 📱 About

Each rendering shows both the front and back of the phone, including:

- Phone body with rounded corners
- Screen with front-facing camera
- Camera bar with dual lenses and flash
- Side buttons (power and volume)

A set of checkboxes lets you toggle each technology's rendering on or off, so you can compare them side by side.

---

## 🛠 Technologies

| Technology | Usage |
|---|---|
| **HTML/CSS** | Declarative box-model drawing using divs, absolute positioning, and border-radius |
| **SVG** | Vector-based drawing using `<rect>`, `<circle>`, and `<g>` elements |
| **Canvas API** | Imperative pixel drawing using `roundRect`, `arc`, and `translate` |
| **p5.js** | Creative coding library drawing using p5's shape and transform API |

---

## 🚀 Getting Started

No build step or dependencies required — just clone and open.

```bash
git clone https://github.com/Jacob-Dawson/pixel-7a-drawing
cd pixel-7a-drawing
```

Then open `index.html` in your browser. If you run into module import issues, serve it locally:

```bash
npx serve .
```

---

## 📁 Project Structure

```
Pixel-7A/
├── index.html
├── css/
│   └── base.css
└── js/
    ├── base.js
    ├── canvas.js
    └── p5Sketch.js
```

---

## ✏️ Design Reference

All dimensions are based on the real Google Pixel 7a specifications:

- **Body:** 72.9 × 152mm
- **Screen:** 63.6 × 141.3mm (6.1", 20:9)
- **Colour:** Charcoal — `#262628` body, `#343437` frame

---

## 🔮 Future Features

- [ ] Colour picker — switch between all four Pixel 7a colours (Charcoal, Snow, Sea, Coral)
- [ ] Front/back toggle per rendering
- [ ] Animated screen lock / wallpaper
- [ ] Comparison mode — overlay two technologies to highlight differences
- [ ] Landscape orientation toggle
- [ ] Annotated view — labelled dimensions overlaid on the drawing
- [ ] Dark/light background toggle

---

## 👤 Author

**Jacob** — [SoloLearn](https://www.sololearn.com/Profile/100073) · [CodePen](https://codepen.io/JDawson) · [GitHub](https://github.com/Jacob-Dawson)

© 5/12 (2026)