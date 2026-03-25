// Renders the Wind
import { formatWindDirection, formatWindSpeed } from "../utils/formatData.js"

export function renderWind(weather){

    const units = "imperial"
    const windWeather = document.querySelector("#wind-weather")

    windWeather.innerHTML = `
        <h3>💨 Wind</h3>
        <p>${formatWindSpeed(weather.windMph,weather.windKph,units)}</p>
        <p>${formatWindDirection(weather.windDir,weather.windDegree)}</p>
    `

}