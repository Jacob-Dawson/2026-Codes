// Renders the precipitation (rain etc)

export function renderPrecipitation(weather){

    const units = "imperial"
    const precipitationWeather = document.querySelector("#precipitation-weather")

    precipitationWeather.innerHTML = `
        <h3>☔ Precipitation</h3>
        <p>${units == "metric" ? Math.round(Number(weather.precipMm))+' mm' : Math.round(Number(weather.precipIn))+' in'}</p>

    `

}