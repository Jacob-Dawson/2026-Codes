// main controller of the project - connects the API to the UI

const loader = document.querySelector("#app-loader")

function showloader(){

    loader.style.display = "flex"

}

function hideloader(){

    loader.style.display = "none"

}

const STORAGE_KEY = "savedLocationsWeather"
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let currentLocation;
let selectedLocation;
let savedLocations = []
const searchInputOverlay = document.querySelector("#search-input")
const searchResultsOverlay = document.querySelector("#search-results")

import { setupContextMenu } from "./ui/contextMenu.js";
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
import { openLocations, closeLocations } from "./ui/locationsSection.js"
import { renderLocations } from "./ui/renderLocations.js"
import { openSearchOverlay, closeSearchOverlay } from "./ui/searchOverlay.js";

//
window.addEventListener("load", async () => {

    showloader()

    try {

        const position = await new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(resolve,reject)

        })

        const lat = position.coords.latitude
        const lon = position.coords.longitude

        await loadWeatherFromCoords(lat,lon)

        savedLocations = await loadSavedLocationsWeather(savedLocations)

        renderLocations(currentLocation,savedLocations,handleLocationSelect)

    } catch (err){

        console.error("App failed to load:", err)

    } finally {

        hideloader()

    }

    

})

document.addEventListener("DOMContentLoaded",async () => {
    // Current + saved locations example

    savedLocations = [
        {name: "Luton"},
        {name: "Budapest"},
        {name: "London"}
    ]

    // loading weather data for saved locations
    savedLocations = await loadSavedLocationsWeather(savedLocations)

    // initial render
    renderLocations(currentLocation, savedLocations, handleLocationSelect)
    setupContextMenu(savedLocations, renderLocations, currentLocation, STORAGE_KEY, handleLocationSelect);

    // open overlay example
    const openBtn = document.querySelector("#open-locations")
    if(openBtn) openBtn.addEventListener("click", () => {
        
        if(currentLocation){
            renderLocations(currentLocation,savedLocations,handleLocationSelect)
            setupContextMenu(savedLocations, renderLocations, currentLocation, STORAGE_KEY, handleLocationSelect);
        }
        openLocations()

    })

    const searchBtn = document.querySelector("#open-search")
    if(searchBtn){

        searchBtn.addEventListener("click", () => {

            openSearchOverlay()

        })

    }

    const searchBack = document.querySelector("#search-back")
    if(searchBack){

        searchBack.addEventListener("click", () => {

            closeSearchOverlay()

        })

    }

})

async function loadSavedLocationsWeather(locations){

    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY))

    if(cached && (Date.now() - cached.timestamp < CACHE_DURATION)){

        return cached.data

    }

    const updatedLocations = []

    for(let loc of locations){

        try{

            const data = await getWeather(loc.name) // fetch real weather
            const weather = formatWeatherData(data)

            updatedLocations.push({
                name: weather.city,
                temp: {
                    temp: weather.temperatureC,
                    tempMin: weather.minTempC,
                    tempMax: weather.maxTempC
                },
                condition: {
                    text: weather.condition,
                    icon: weather.icon
                }
            });

        } catch (err) {

            console.error("Failed to load weather for", loc.name, err);

            // fallback to original dummy data if API fails
            updatedLocations.push(loc);

        }

    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: updatedLocations,
        timestamp: Date.now()
    }))

    return updatedLocations

}

async function handleLocationSelect(locationName){

    await loadWeather(locationName)
    closeLocations()

}

async function loadWeather(locationName){

    const data = await getWeather(locationName)
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

    // update current location
    selectedLocation = {
        name: weather.city,
        temp: {
            temp: weather.temperatureC,
            tempMin: weather.minTempC,
            tempMax: weather.maxTempC
        },
        condition: {
            text: weather.condition,
            icon: weather.icon
        }
    }

    // re-render locations overlay data
    renderLocations(currentLocation,savedLocations,handleLocationSelect)
    setupContextMenu(savedLocations, renderLocations, currentLocation, STORAGE_KEY, handleLocationSelect);

}

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

    // update current location
    currentLocation = {
        name: weather.city,
        temp: {
            temp: weather.temperatureC,
            tempMin: weather.minTempC,
            tempMax: weather.maxTempC
        },
        condition: {
            text: weather.condition,
            icon: weather.icon
        }
    }

    // re-render locations overlay data
    renderLocations(currentLocation,savedLocations,handleLocationSelect)
    setupContextMenu(savedLocations, renderLocations, currentLocation, STORAGE_KEY, handleLocationSelect);

}

searchInputOverlay.addEventListener("input", async () => {

    if(searchInputOverlay.value.length < 3) return

    const locations = await searchLocations(searchInputOverlay.value)

    searchResultsOverlay.innerHTML = locations
        .map(loc => `
            <li data-city="${loc.name}">
                ${loc.name}, ${loc.country}
            </li>
        `).join("")

})

searchResultsOverlay.addEventListener("click", async (e) => {

    const city = e.target.dataset.city
    if(!city) return

    // prevent dupes
    if(savedLocations.some(loc => loc.name === city)){

        closeSearchOverlay()
        return

    }

    // fetch real weather
    const data = await getWeather(city)
    const weather = formatWeatherData(data)

    const newLocation = {
        name: weather.city,
        temp: {
            temp: weather.temperatureC,
            tempMin: weather.minTempC,
            tempMax: weather.maxTempC
        },
        condition: {
            text: weather.condition,
            icon: weather.icon
        }
    }

    // add to array
    savedLocations.push(newLocation)

    // update cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: savedLocations,
        timestamp: Date.now()
    }))

    // update UI
    renderLocations(currentLocation,savedLocations,handleLocationSelect)

    closeSearchOverlay()

})