// Renders the Wind
import { formatWindDirection, formatWindSpeed } from "../utils/formatData.js"

export function renderWind(weather){

    const units = "imperial"
    const windWeather = document.querySelector("#wind-weather")

    if(!weather){

        console.error("renderWind: weather is missing",weather)

        windWeather.innerHTML = `
            <h3>💨 Wind</h3>
            <p>Data Unavailable</p>
            <p>Data Unavailable</p>
        `
        return

    }

    // fallbacks
    const windSpeedMph = weather.windMph ?? null
    const windSpeedKph = weather.windKph ?? null
    const windDir = weather.windDir ?? null
    const windDegree = weather.windDegree ?? null
    
    const speedText = (windSpeedMph != null || windSpeedKph != null)
        ? formatWindSpeed(windSpeedMph, windSpeedKph, units)
        : "Unavailable"

    const directionText = (windDir != null || windDegree != null)
        ? formatWindDirection(windDir,windDegree)
        : "Unavailable"

    windWeather.innerHTML = `
        <h3>💨 Wind</h3>
        <p>${speedText}</p>
        <p>${directionText}</p>
    `

}