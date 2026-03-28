// Renders the forecast by hours

import {formatTime, calcChanceOfRain, formatTemp} from "../utils/formatData.js"

export function renderForecastHour(hours){

    const units = "metric";
    const hourDayViewContainer = document.querySelector("#hour-day-view")
    
    // guard clause
    if(!Array.isArray(hours) || hours.length === 0){

        console.error("renderForecastHour: hours data is missing or empty", hours)
        hourDayViewContainer.innerHTML = `
            <h3>🕗 Hourly Forecast</h3>
            <p>Data Unavailable</p>
        `
        return
    }

    hourDayViewContainer.innerHTML = `
        <h3>🕗 Hourly Forecast</h3>
        <div id="forecast-hour-container">
            ${hours.map((hour,index) => createForecastHourHTML(hour,index,units)).join("")}
        </div>`

}

function createForecastHourHTML(hour,index,units){

    // guard clause
    if(!hour){

        return `
        <div class="forecast-hour">
            <p>Unknown</p>
            <p>Data Unavailable</p>
        </div>`

    }

    // fallbacks
    const timeText = index === 0 ? "Now" : formatTime(hour.time ?? "")
    const iconSrc = hour.condition?.icon ?? ""
    const conditionText = hour.condition?.text ?? "Unavailable"
    const chanceOfRain = calcChanceOfRain(hour.chance_of_rain ?? null ) ?? "0%"
    const temp = formatTemp(hour.temp_c ?? null, hour.temp_f ?? null, units) ?? "--"

    return `
        <div class="forecast-hour">
            <p>${timeText}</p>
            <img src="${iconSrc}" alt="${conditionText}"/>
            <p>${chanceOfRain}</p>
            <p>${temp}</p>
        </div>`

}