// data layer of the project (weather service)

const API_KEY = "68894964541e4fa1ac9204510260503"
const BASE_URL = "https://api.weatherapi.com/v1"

export async function fetchWeatherByCoords(lat, lon){

    const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`
    )
    
    if(!response.ok){

        throw new Error("Geolocation failed")

    }

    return response.json()

}

export async function getWeather(city){

    const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes&alerts=yes`
    )

    if(!response.ok){

        throw new Error("Weather data failed")

    }

    return response.json()

}