// Renders the precipitation (rain etc)

import { formatPrecipitation } from "../utils/formatData.js"

export function renderPrecipitation(weather){

    const units = "imperial"
    const precipitationWeather = document.querySelector("#precipitation-weather")

    if(!weather){

        console.error("renderPrecipitation: weather is missing",weather)

        precipitationWeather.innerHTML = `
            <h3>☔ Precipitation</h3>
            <p>Data Unavailable</p>
        `

        return

    }

    // fallbacks
    const rainMm = weather.precipMm ?? null
    const rainIn = weather.precipIn ?? null

    const precipText = (rainMm != null || rainIn != null)
        ? formatPrecipitation(rainMm,rainIn,units)
        : "Unavailable"

    precipitationWeather.innerHTML = `
        <h3>☔ Precipitation</h3>
        <p>${precipText}</p>
    `

}