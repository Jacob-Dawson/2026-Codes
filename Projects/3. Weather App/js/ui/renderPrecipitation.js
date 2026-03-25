// Renders the precipitation (rain etc)

import { formatPrecipitation } from "../utils/formatData.js"

export function renderPrecipitation(weather){

    const units = "imperial"
    const precipitationWeather = document.querySelector("#precipitation-weather")

    precipitationWeather.innerHTML = `
        <h3>☔ Precipitation</h3>
        <p>${formatPrecipitation(weather.precipMm,weather.precipIn,units)}</p>
    `

}