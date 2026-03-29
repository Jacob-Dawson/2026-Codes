// main controller of the project - connects the API to the UI

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

// state
const state = {
    currentLocation: null,
    selectedLocation: null,
    savedLocations: []
}

const STORAGE_KEY = "savedLocationsWeather"
const CACHE_DURATION = 10 * 60 * 1000;

// DOM

const loader = document.querySelector("#app-loader")
const searchInputOverlay = document.querySelector("#search-input")
const searchResultsOverlay = document.querySelector("#search-results")

// Loader

function showloader(){

    loader.classList.remove("fade-out")

}

function hideloader(){

    loader.classList.add("fade-out")

}

// Initial Load

window.addEventListener("load", async () => {

    showloader()

    try {

        const position = await new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(resolve,reject)

        })

        const { latitude: lat, longitude: lon } = position.coords
        await loadWeatherFromCoords(lat,lon)

        // Load saved locations from cache or default
        const initialLocations = [
            {name: "Luton"},
            {name: "Budapest"},
            {name: "London"}
        ]

        // loading weather data for saved locations
        const loadedLocations = await loadSavedLocationsWeather(initialLocations)
        state.savedLocations = loadedLocations

        renderLocations(state.currentLocation, state.savedLocations, handleLocationSelect)
        setupContextMenu(state.savedLocations, renderLocationsWrapper, state.selectedLocation || state.currentLocation, STORAGE_KEY, handleLocationSelect, updateSavedLocationsOrder);

    } catch (err){

        console.error("App failed to load:", err)

    } finally {

        hideloader()

    }

})

// DOMContent Loaded

document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.querySelector("#open-locations")

    if(openBtn) openBtn.addEventListener("click",() => {

        renderLocationsWrapper()
        openLocations()

    })

    const searchBtn = document.querySelector("#open-search")
    if(searchBtn) searchBtn.addEventListener("click",openSearchOverlay)

    const searchBack = document.querySelector("#search-back")
    if(searchBack) searchBack.addEventListener("click",closeSearchOverlay)

    searchInputOverlay.addEventListener("input",onSearchInput)
    searchResultsOverlay.addEventListener("click",onSearchSelect)

})

// Wrapper for consistent rendering
function renderLocationsWrapper(){

    renderLocations(state.currentLocation, state.savedLocations, handleLocationSelect);
    setupContextMenu(
        state.savedLocations,
        renderLocationsWrapper,
        state.currentLocation,
        STORAGE_KEY,
        handleLocationSelect,
        updateSavedLocationsOrder
    );
}

// syncs savedlocations order
function updateSavedLocationsOrder(newOrder) {
    state.savedLocations = [...newOrder];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: state.savedLocations,
        timestamp: Date.now()
    }));
}

// Load saved Locations
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

// Load Weather for a location
async function loadWeather(locationName){

    showloader()

    try{

        const data = await getWeather(locationName)
        const weather = formatWeatherData(data)

        renderAllWeatherSections(weather, data)
        state.selectedLocation = {
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
        renderLocationsWrapper()

    } catch (err){

        console.error("Failed to load weather for",locationName,err)

    } finally{

        hideloader()

    }
}

// Load weather from Coords
async function loadWeatherFromCoords(lat, lon) {

    showloader()
    
    try{

        const data = await fetchWeatherByCoords(lat, lon)
        const weather = formatWeatherData(data)

        renderAllWeatherSections(weather, data)
        state.currentLocation = {
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
        renderLocationsWrapper()

    } catch (err){

        console.error("Failed to load weather for",err)

    } finally{

        hideloader()

    }
    
}

// Render all Weather Sections
function renderAllWeatherSections(weather,rawData){

    renderAlerts(rawData.alerts?.alert)
    renderCurrentWeather(weather)
    renderForecast(weather)
    renderForecastHour(weather.forecastHour)
    renderPrecipitation(weather)
    renderWind(weather)
    renderHealth(weather)
    renderAstronomy(weather)
    renderWeatherMap(rawData.location.lat, rawData.location.lon)
    applyWeatherTheme(weather)

}

// Handle Location Select
async function handleLocationSelect(locationName){

    await loadWeather(locationName)
    closeLocations()

}

// Search Overlay
async function onSearchInput(){

    const query = searchInputOverlay.value

    if(!query || query.length < 3) return

    const locations = await searchLocations(query)
    searchResultsOverlay.innerHTML = locations.map(loc => 
        `<li data-city="${loc.name}">
            ${loc.name}, ${loc.country}
        </li>`
    ).join("")

}

async function onSearchSelect(e){

    const city = e.target.dataset.city
    if(!city) return

    // no dupes
    if(state.savedLocations.some(loc => loc.name === city)){
        closeSearchOverlay()
        return
    }

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

    state.savedLocations.push(newLocation)

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: state.savedLocations,
        timestamp: Date.now()
    }))

    renderLocationsWrapper()
    closeSearchOverlay()

}