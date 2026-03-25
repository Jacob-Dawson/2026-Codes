// Formatting the data

export function formatWeatherData(data){

    const today = data.forecast.forecastday[0]
    const tomorrow = data.forecast.forecastday[1]

    const currentHour = new Date().getHours()

    const next24Hours = [
        ...today.hour.slice(currentHour),
        ...tomorrow.hour.slice(0,currentHour+1)
    ]

    const weekDays = 0;

    //console.log(next24Hours)

    return {
        city: data.location.name,
        country: data.location.country,
        temperatureC: data.current.temp_c,
        temperatureF: data.current.temp_f,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        code: data.current.condition.code,
        isDay: data.current.is_day,
        feelslikeC: data.current.feelslike_c,
        feelslikeF: data.current.feelslike_f,
        maxTempC: today.day.maxtemp_c,
        maxTempF: today.day.maxtemp_f,
        minTempC: today.day.mintemp_c,
        minTempF: today.day.mintemp_f,
        // daily forecast
        forecast: data.forecast.forecastday.map(day => ({
            date: day.date,
            avgTempC: day.day.avgtemp_c,
            avgTempF: day.day.avgtemp_f,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
            uv: day.day.uv,
            maxTempC: day.day.maxtemp_c,
            maxTempF: day.day.maxtemp_f,
            minTempC: day.day.mintemp_c,
            minTempF: day.day.mintemp_f,
            chanceOfRain: day.day.daily_chance_of_rain
        })),
        // hourly forecast
        forecastHour: next24Hours,
        // precipitation
        precipMm: data.current.precip_mm,
        precipIn: data.current.precip_in,
        // wind
        windKph: data.current.wind_kph,
        windMph: data.current.wind_mph,
        windDegree: data.current.wind_degree,
        windDir: data.current.wind_dir,
        // health (air quality and uv)
        airQuality: data.current.air_quality.pm2_5,
        gbIndex: data.current.air_quality["gb-defra-index"],
        uv: data.current.uv,
        // astronomy
        astronomy: {
            sunrise: today.astro.sunrise,
            sunset: today.astro.sunset,
            moonRise: today.astro.moonrise,
            moonSet: today.astro.moonset,
            moonPhase: today.astro.moon_phase,
            moonIllumination: today.astro.moon_illumination
        }
    }

}

export function formatLocation(loc){

    return `📍 ${loc.city}, ${loc.country}`

}

export function formatWeatherDetails(weather){

    return `<img src="${weather.icon}"/> <p>${weather.condition}</p>`

}

export function formatDate(date){

    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "numeric"
    })

}

export function formatTime(time){

    return new Date(time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    })

}

export function calcChanceOfRain(chance){

    return `${Math.round(chance / 10)*10}%`

}

export function formatTemp(tempC,tempF,units){

    return `${units == "metric" ? Math.round(Number(tempC))+'°C' : Math.round(Number(tempF))+'°F'}`

}

export function formatPrecipitation(precipMm,precipIn,units){

    return `${units == "metric" ? Math.round(Number(precipMm))+' mm' : Math.round(Number(precipIn))+' in'}`

}

export function formatWindSpeed(windMph,windKph,units){

    return `${units == "metric" ? Math.round(Number(windKph))+' kph' : Math.round(Number(windMph))+' mph'}`

}

export function formatWindDirection(windDir,windDeg){

    return `From: ${windDir} (${windDeg}°)`

}

export function getAirQualityLabel(index){

    let result = "";

    if(index <= 3) result = "Low"
    else if(index <= 6) result = "Moderate"
    else if(index <= 9) result = "High"
    else result = "Very High"

    return `${index+" ("+result+")"}`

}

export function formatUVIndex(uv){

    return `UV Index: ${Math.round(4*(uv))}`

}

export function formatSunAstronomy(astronomy){

    return `
        <p>Sunrise: ${astronomy.sunrise}</p>
        <p>Sunset: ${astronomy.sunset}</p>
    `

}

export function formatMoonAstronomy(astronomy){

    return `
        <p>Moon phase: ${astronomy.moonPhase}</p>
        <p>Moon Illumination: ${Number(astronomy.moonIllumination)/100 * 100}%</p>
    `

}