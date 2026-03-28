// Renders the astronomy (moon etc)

import { formatSunAstronomy, formatMoonAstronomy } from "../utils/formatData.js"

export function renderAstronomy(weather){

    const sunAstrology = document.querySelector("#sun-astrology")
    const moonAstrology = document.querySelector("#moon-astrology")

    if(!weather){

        console.error("renderAstronomy: astronomy is missing", weather)

         sunAstrology.innerHTML = `
            <h3>🌅 Sun</h3>
            <p>Data unavailable</p>
        `
        moonAstrology.innerHTML = `
            <h3>🌃 Moon</h3>
            <p>Data unavailable</p>
        `

        return

    }

    const astronomy = weather.astronomy
    if (!astronomy) {
        console.error("renderAstronomy: astronomy data missing", weather)

        sunAstrology.innerHTML = `
            <h3>🌅 Sun</h3>
            <p>Data unavailable</p>
        `
        moonAstrology.innerHTML = `
            <h3>🌃 Moon</h3>
            <p>Data unavailable</p>
        `
        return
    }

    const sunInfo = formatSunAstronomy(astronomy) ?? "Unavailable"
    const moonInfo = formatMoonAstronomy(astronomy) ?? "Unavailable"

    sunAstrology.innerHTML = `
        <h3>🌅 Sun</h3>
        <div>${sunInfo}</div>
    `

    moonAstrology.innerHTML = `
        <h3>🌃 Moon</h3>
        <div>${moonInfo}</div>
    `

}