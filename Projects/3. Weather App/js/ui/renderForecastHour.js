// Renders the forecast by hours

import {formatTime, calcChanceOfRain, formatTemp} from "../utils/formatData.js"

export function renderForecastHour(hours){

    const units = "metric";
    const hourDayViewContainer = document.querySelector("#hour-day-view")
    let counter = 0;

    hourDayViewContainer.innerHTML = `
        <h3>🕗 Hourly Forecast</h3>
        <div id="forecast-hour-container">
            ${hours.map((hour,index) => createForecastHourHTML(hour,index,units)).join("")}
        </div>`

}

function createForecastHourHTML(hour,index,units){

    return `
        <div class="forecast-hour">
            <p>${index === 0 ? "Now" : formatTime(hour.time)}</p>`
            //<p>${hour.condition.text}</p>
            +`<img src="${hour.condition.icon}"/>
            <p>${calcChanceOfRain(hour.chance_of_rain)}</p>
            <p>${formatTemp(hour.temp_c,hour.temp_f,units)}</p>
        </div>`

}