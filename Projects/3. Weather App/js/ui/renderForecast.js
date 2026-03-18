// Renders the weather forecast

export function renderForecast(weather){

    const units = "metric";
    const forecastContainer = document.querySelector("#forecast")

    //const days = data.forecast.forecastday
    
    forecastContainer.innerHTML = `
        <h3>📅 7-Day Forecast</h3>
        <div id="forecast-day-container">
            ${weather.forecast.map(day => `
                <div class="forecast-day">
                    <p>${new Date(day.date).toString().split(" ")[2] == (new Date().toString().split(" ")[2]) ? "Today" : new Date(day.date).toString().split(" ")[0]}</p>
                    <p>${new Date(day.date).getMonth()+1}/${new Date(day.date).getDate()}</p>`
                    //<p>${day.condition}</p>
                    +`<img src="${day.icon}"/>
                    <p>${Math.round(day.chanceOfRain / 10)*10}%</p>
                    <p>${units == "metric" ? Math.round(Number(day.maxTempC))+'°C' : Math.round(Number(day.maxTempF))+'°F'}</p>
                    <p>${units == "metric" ? Math.round(Number(day.minTempC))+'°C' : Math.round(Number(day.minTempF))+'°F'}</p>
                </div>`
            ).join("")}
        </div>`

}