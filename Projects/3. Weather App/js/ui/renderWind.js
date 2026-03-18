// Renders the Wind

export function renderWind(weather){

    const units = "imperial"
    const windWeather = document.querySelector("#wind-weather")

    windWeather.innerHTML = `
        <h3>💨 Wind</h3>
        <p>${units == "metric" ? Math.round(Number(weather.windKph))+' kph' : Math.round(Number(weather.windMph))+' mph'}</p>
        <p>From: ${weather.windDir + ' ('+ weather.windDegree +'°)'} </p>

    `

}