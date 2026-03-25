// main controller of the project - connects the API to the UI

import { searchLocations } from "./api/locationService.js"
import { getWeather, fetchWeatherByCoords } from "./api/weatherService.js"
import { renderAstronomy } from "./ui/renderAstronomy.js"
import { renderCurrentWeather } from "./ui/renderCurrentWeather.js"
import { renderForecast } from "./ui/renderForecast.js"
import { renderForecastHour } from "./ui/renderForecastHour.js"
import { renderHealth } from "./ui/renderHealth.js"
import { renderPrecipitation } from "./ui/renderPrecipitation.js"
import { renderWind } from "./ui/renderWind.js"
import { formatWeatherData } from "./utils/formatData.js"
import { renderWeatherMap } from "./ui/renderWeatherMap.js"
import { renderAlerts } from "./ui/renderAlerts.js"
import { applyWeatherTheme } from "./ui/applyWeatherTheme.js"

const searchForm = document.querySelector("#search-form")
const input = document.querySelector("#city-input")
const results = document.querySelector("#autocomplete")

window.addEventListener("load", () => {

    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        loadWeatherFromCoords(lat,lon)
    })

})

async function loadWeatherFromCoords(lat, lon) {

    const data = await fetchWeatherByCoords(lat, lon)
    const weather = formatWeatherData(data)

    renderAlerts(data.alerts.alert)
    renderCurrentWeather(weather)
    renderForecast(weather)
    renderForecastHour(weather.forecastHour)
    renderPrecipitation(weather)
    renderWind(weather)
    renderHealth(weather)
    renderAstronomy(weather)
    renderWeatherMap(data.location.lat, data.location.lon)
    applyWeatherTheme(weather)
    
}

searchForm.addEventListener("submit", async (e) =>{

    e.preventDefault();

    if(input.value.length < 3){

        return

    }

    const locations = await searchLocations(input.value)

    results.innerHTML = locations
        .map(loc => `<li data-city="${loc.name}">${loc.name}, ${loc.country}</li>`)
        .join("")

})

searchForm.addEventListener("input", async () => {

    if(input.value.length < 3){

        return

    }

    const locations = await searchLocations(input.value)

    results.innerHTML = locations
        .map(loc => `<li data-city="${loc.name}">${loc.name}, ${loc.country}</li>`)
        .join("")
})

results.addEventListener("click", async (e) => {

    input.value = e.target.dataset.city

    const city = e.target.dataset.city

    try{
        
        const data = await getWeather(city)
        const weather = formatWeatherData(data)

        renderAlerts(data.alerts.alert)
        renderCurrentWeather(weather)
        renderForecast(weather)
        renderForecastHour(weather.forecastHour)
        renderPrecipitation(weather)
        renderWind(weather)
        renderHealth(weather)
        renderAstronomy(weather)
        renderWeatherMap(data.location.lat, data.location.lon)
        applyWeatherTheme(weather)

    } catch (error){

        console.error(error)

    }

})