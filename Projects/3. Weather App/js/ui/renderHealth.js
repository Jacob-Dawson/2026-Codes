// Renders the Health warnings on weather (UV, Air Quality etc)

import { getAirQualityLabel, formatUVIndex } from "../utils/formatData.js"

export function renderHealth(weather){

    const UVContainer = document.querySelector("#uv-index-weather")
    const airContainer = document.querySelector("#air-quality-weather")

    UVContainer.innerHTML = `
        <h3>🔆 UV Index</h3>
        <p>${formatUVIndex(weather.uv)}</p>
    `

    airContainer.innerHTML = `
        <h3>🍃 Air Quality</h3>
        <p>${getAirQualityLabel(weather.gbIndex)}</p>
    `

}