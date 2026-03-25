// Renders the weather forecast

import {formatDate, calcChanceOfRain, formatTemp} from "../utils/formatData.js"

export function renderForecast(weather){

    const units = "metric";
    const forecastContainer = document.querySelector("#forecast")

    //const days = data.forecast.forecastday
    
    forecastContainer.innerHTML = `
        <h3>📅 3-Day Forecast</h3>
        <div id="forecast-day-container">
            ${weather.forecast.map((day,index) => createForecastDayHTML(day,index,units)
            ).join("")}
        </div>`

}

function createForecastDayHTML(day,index,units){

    return `
        <div class="forecast-day">
            <p>${index === 0 ? "Today" : formatDate(day.date).split(" ")[0].slice(0,-1)}</p>
            <p>${formatDate(day.date).split(" ")[1]}</p>`
            //<p>${day.condition}</p>
            +`<img src="${day.icon}"/>
            <p>${calcChanceOfRain(day.chanceOfRain)}</p>
            <p>${formatTemp(day.maxTempC,day.maxTempF,units)}</p>
            <p>${formatTemp(day.minTempC,day.minTempF,units)}</p>
        </div>`

}