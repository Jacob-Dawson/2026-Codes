// Rendering the current weather

export function renderCurrentWeather(weather){

    const units = "metric"
    const container = document.querySelector("#current-weather")

    container.innerHTML = `
        <h2>${weather.city}, ${weather.country}</h2>
        <div><img src="${weather.icon}"/><p>${weather.condition}</p></div>
        <p>${units == "metric" ? Math.round(Number(weather.temperatureC))+'°C' : Math.round(Number(weather.temperatureF))+'°F'}</p>
        <p>Feels like ${units == "metric" ? Math.round(Number(weather.feelslikeC))+'°C' : Math.round(Number(weather.feelslikeF))+'°F'}</p>
        <p>High ${units == "metric" ? Math.round(Number(weather.maxTempC))+'°C' : Math.round(Number(weather.maxTempF))+'°F'} - Low ${units == "metric" ? Math.round(Number(weather.minTempC))+'°C' : Math.round(Number(weather.minTempF))+'°F'}</p>`

}