// Renders the weather forecast

import {formatDate, calcChanceOfRain, formatTemp} from "../utils/formatData.js"

export function renderForecast(weather){

    const units = "metric";
    const forecastContainer = document.querySelector("#forecast")

    // guard clause
    if(!weather || !Array.isArray(weather.forecast) || weather.forecast.length === 0){

        console.error("renderForecast: forecast data missing or invalid:",weather)
        forecastContainer.innerHTML = `
            <h3>📅 3-Day Forecast</h3>
            <div id="forecast-day-container">
                ${weather.forecast.map((day,index) => createForecastDayHTML(day,index,units)
                ).join("")}
            </div>`

        return
    }
    
    forecastContainer.innerHTML = `
        <h3>📅 3-Day Forecast</h3>
        <div id="forecast-day-container">
            ${weather.forecast.map((day,index) => createForecastDayHTML(day,index,units)
            ).join("")}
        </div>`

}

function createForecastDayHTML(day,index,units){

    // guard clause
    if(!day){

        return `<div class="forecast-day">
                    <p>Unknown</p>
                    <p>Data Unavailable</p>
                </div>`

    }

    // fallbacks
    const dateText = day.date ? formatDate(day.date).split(" ")[0].slice(0, -1) : "Unknown"
    const dayName = day.date ? formatDate(day.date).split(" ")[1] : ""
    const iconSrc = day.icon ?? ""
    const conditionText = day.condition ?? "Unavailable"
    const chanceOfRain = day.chanceOfRain != null ? calcChanceOfRain(day.chanceOfRain) : "0%"
    const maxTemp = formatTemp(day.maxTempC ?? null, day.maxTempF ?? null, units) ?? "--"
    const minTemp = formatTemp(day.minTempC ?? null, day.minTempF ?? null, units) ?? "--"

    return `
        <div class="forecast-day">
            <p>${index === 0 ? "Today" : dateText}</p>
            <p>${dayName}</p>
            <img src="${iconSrc}" alt="${conditionText}"/>
            <p>${chanceOfRain}</p>
            <p>${maxTemp}</p>
            <p>${minTemp}</p>
        </div>`

}