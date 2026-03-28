// Renders the Health warnings on weather (UV, Air Quality etc)

import { getAirQualityLabel, formatUVIndex } from "../utils/formatData.js"

export function renderHealth(weather){

    const UVContainer = document.querySelector("#uv-index-weather")
    const airContainer = document.querySelector("#air-quality-weather")

    if(!weather){

        console.error("renderHealth: weather is missing",weather)

        UVContainer.innerHTML = `
            <h3>🔆 UV Index</h3>
            <p>Data Unavailable</p>
        `

        airContainer.innerHTML = `
            <h3>🍃 Air Quality</h3>
            <p>Data Unavailable</p>
        `
        return
    }

    // fallbacks
    const uvValue = weather.uv ?? null
    const airValue = weather.gbIndex ?? null

    const uvLabel = uvValue != null ? formatUVIndex(uvValue) : "Unavailable"
    const airLabel = airValue != null ? getAirQualityLabel(airValue) : "Unavailable"

    UVContainer.innerHTML = `
        <h3>🔆 UV Index</h3>
        <p>${uvLabel}</p>
    `

    airContainer.innerHTML = `
        <h3>🍃 Air Quality</h3>
        <p>${airLabel}</p>
    `

}