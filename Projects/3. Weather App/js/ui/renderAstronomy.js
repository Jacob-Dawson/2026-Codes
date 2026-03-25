// Renders the astronomy (moon etc)

import { formatSunAstronomy, formatMoonAstronomy } from "../utils/formatData.js"

export function renderAstronomy(weather){

    const sunAstrology = document.querySelector("#sun-astrology")
    const moonAstrology = document.querySelector("#moon-astrology")

    sunAstrology.innerHTML = `
        <h3>🌅 Sun</h3>
        <div>${formatSunAstronomy(weather.astronomy)}</div>
    `

    moonAstrology.innerHTML = `
        <h3>🌃 Moon</h3>
        <div>${formatMoonAstronomy(weather.astronomy)}</div>
    `

}