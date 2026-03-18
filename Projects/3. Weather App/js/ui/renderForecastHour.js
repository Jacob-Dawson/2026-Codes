// Renders the forecast by hours

export function renderForecastHour(hours){

    const units = "metric";
    const hourDayViewContainer = document.querySelector("#hour-day-view")
    let counter = 0;

    hourDayViewContainer.innerHTML = `
        <h3>🕗 Hourly Forecast</h3>
        <div id="forecast-hour-container">
            ${hours.map((hour,index) => `
                <div class="forecast-hour">
                    <p>${index === 0 ? "Now" : hour.time.split(" ")[1]}</p>`
                    //<p>${hour.condition.text}</p>
                    +`<img src="${hour.condition.icon}"/>
                    <p>${Math.round(hour.chance_of_rain / 10)*10}%</p>
                    <p>${units == "metric" ? Math.round(Number(hour.temp_c))+'°C' : Math.round(Number(hour.temp_f))+'°F'}</p>
                </div>
            `).join("")}
        </div>`

}