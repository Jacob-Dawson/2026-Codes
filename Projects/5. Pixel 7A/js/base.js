// js goes here
import { drawCanvas } from "./canvas.js";
import { sketch } from "./p5Sketch.js"

drawCanvas()
new p5 (sketch)

document.querySelectorAll(".filter").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const target = document.querySelector(`.phone--${checkbox.dataset.tech}`)
        target.style.display = checkbox.checked ? 'block' : 'none';
    }, false)
})