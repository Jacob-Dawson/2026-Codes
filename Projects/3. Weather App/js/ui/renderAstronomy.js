// Renders the astronomy (moon etc)

export function renderAstronomy(weather){

    const sunAstrology = document.querySelector("#sun-astrology")
    const moonAstrology = document.querySelector("#moon-astrology")

    sunAstrology.innerHTML = `
        <h3>🌅 Sun</h3>
        <p>Sunrise: ${weather.astronomy.sunrise}</p>
        <p>Sunset: ${weather.astronomy.sunset}</p>
    `

    moonAstrology.innerHTML = `
        <h3>🌃 Moon</h3>
        <p>Moon phase: ${weather.astronomy.moonPhase}</p>
        <p>Moon Illumination: ${Number(weather.astronomy.moonIllumination)/100 * 100}%</p>
    `

}