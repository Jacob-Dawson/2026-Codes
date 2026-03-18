// Renders the Health warnings on weather (UV, Air Quality etc)

export function renderHealth(weather){

    const UVContainer = document.querySelector("#uv-index-weather")
    const airContainer = document.querySelector("#air-quality-weather")

    UVContainer.innerHTML = `
        <h3>🔆 UV Index</h3>
        <p>UV Index: ${Math.round(4*(weather.uv))}</p>
    `

    airContainer.innerHTML = `
        <h3>🍃 Air Quality</h3>
        <p>${weather.gbIndex} (${weather.airQuality}) µg/m³</p>
    `

}