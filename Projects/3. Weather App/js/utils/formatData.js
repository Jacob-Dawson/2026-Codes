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

    console.log(next24Hours)

    return {
        city: data.location.name,
        country: data.location.country,
        temperatureC: data.current.temp_c,
        temperatureF: data.current.temp_f,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
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
        gbIndex: data.current.air_quality.gb_defra_index,
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