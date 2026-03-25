// Rendering the current weather

import { formatLocation, formatTemp, formatWeatherDetails } from "../utils/formatData.js"

export function renderCurrentWeather(weather){

    const units = "metric"
    const container = document.querySelector("#current-weather")

    container.innerHTML = `
        <h2>${formatLocation(weather)}</h2>
        <div>${formatWeatherDetails(weather)}</div>
        <p>${formatTemp(weather.temperatureC,weather.temperatureF,units)}</p>
        <p>Feels like ${formatTemp(weather.feelslikeC,weather.feelslikeF,units)}</p>
        <p>High ${formatTemp(weather.maxTempC,weather.maxTempF,units)} - Low ${formatTemp(weather.minTempC,weather.minTempF,units)}</p>`

}