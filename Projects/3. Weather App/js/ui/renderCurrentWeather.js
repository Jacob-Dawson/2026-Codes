// Rendering the current weather

import { formatLocation, formatTemp, formatWeatherDetails } from "../utils/formatData.js"

export function renderCurrentWeather(weather){

    const units = "metric"
    const container = document.querySelector("#current-weather")

    if(!weather){

        console.error("renderCurrentWeather: weather is missing", weather)

        container.innerHTML = `
            <h2>Weather unavailable</h2>
            <p>Please try again later</p>`

        return

    }

    const {
        temperatureC,
        temperatureF,
        feelslikeC,
        feelslikeF,
        maxTempC,
        maxTempF,
        minTempC,
        minTempF
    } = weather

    const location = formatLocation(weather) ?? "Unknown location"
    const details = formatWeatherDetails(weather) ?? "No details"

    const temp = (temperatureC != null || temperatureF != null)
        ? formatTemp(temperatureC, temperatureF, units)
        : "--"

    const feelsLike = (feelslikeC != null || feelslikeF != null)
        ? formatTemp(feelslikeC, feelslikeF, units)
        : "--"
    
    const high = (maxTempC != null || maxTempF != null)
        ? formatTemp(maxTempC, maxTempF, units)
        : "--"

    const low = (minTempC != null || minTempF != null)
        ? formatTemp(minTempC, minTempF, units)
        : "--"

    container.innerHTML = `
        <h2>${location}</h2>
        <div>${details}</div>
        <p>${temp}</p>
        <p>Feels like ${feelsLike}</p>
        <p>High ${high} - Low ${low}</p>`

}