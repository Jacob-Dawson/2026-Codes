// Change color background of the app

function getWeatherGroup(code) {

    if (code === 1000) return "clear";

    if ([1003, 1006, 1009].includes(code)) return "cloudy";

    if (
        (code >= 1180 && code <= 1201) ||
        (code >= 1240 && code <= 1246)
    ) return "rain";

    if (
        (code >= 1210 && code <= 1225) ||
        (code >= 1255 && code <= 1282)
    ) return "snow";

    if (code >= 1273 && code <= 1282) return "thunder";

    if ([1030, 1135, 1147].includes(code)) return "fog";

    if ([1069, 1204, 1207].includes(code)) return "sleet";

    return "default";
}

const themes = {
    clear: {
        day: "linear-gradient(to top, #4FC3F7, #81D4FA)",
        night: "linear-gradient(to top, #0D47A1, #1976D2)"
    },
    cloudy: {
        day: "linear-gradient(to top, #90A4AE, #CFD8DC)",
        night: "linear-gradient(to top, #37474F, #263238)"
    },
    rain: {
        day: "linear-gradient(to top, #607D8B, #90A4AE)",
        night: "linear-gradient(to top, #263238, #37474F)"
    },
    snow: {
        day: "linear-gradient(to top, #E1F5FE, #FFFFFF)",
        night: "linear-gradient(to top, #90CAF9, #E3F2FD)"
    },
    thunder: {
        day: "linear-gradient(to top, #616161, #9E9E9E)",
        night: "linear-gradient(to top, #212121, #424242)"
    },
    fog: {
        day: "linear-gradient(to top, #B0BEC5, #ECEFF1)",
        night: "linear-gradient(to top, #455A64, #607D8B)"
    },
    sleet: {
        day: "linear-gradient(to top, #78909C, #B0BEC5)",
        night: "linear-gradient(to top, #37474F, #546E7A)"
    },
    default: {
        day: "linear-gradient(to top, #64B5F6, #90CAF9)",
        night: "linear-gradient(to top, #1E88E5, #1565C0)"
    }
};

export function applyWeatherTheme(weather) {

    // guard clause
    if(!weather){

        console.error("applyWeatherTheme: weather missing",weather)
        return

    }

    const code = weather.code ?? null
    const isDay = weather.isDay

    // safe theme selection
    const group = getWeatherGroup(code);
    const theme = themes[group] ?? theme.default;

    const isDayTime = isDay === 1

    const background = isDayTime ? theme.day : theme.night;

    document.body.style.background = background;

    // cache theme values (avoid repitition)
    const sectionColor = isDayTime
        ? "var(--col-section-day)"
        : "var(--col-section-night)"

    const sectionBg = isDayTime
        ? "var(--bg-col-section-day)"
        : "var(--bg-col-section-night)"

    const borderColor = isDayTime
        ? "var(--col-section-day)"
        : "var(--border-forecastDay-col)"

    const openLocationCol = isDayTime
        ? "var(--col-section-day)"
        : "var(--col-section-night)"

    // Apply to grid sections (safe)
    const gridSections = document.querySelectorAll("#weather-outputs > section");

    gridSections.forEach(section => {

        section.style.color = sectionColor
        section.style.background = sectionBg

    })

    // Apply to forecast cards
    const forecastDays = document.querySelectorAll(".forecast-day")

    forecastDays.forEach(day => {

        day.style.color = sectionColor
        day.style.background = sectionBg
        day.style.borderColor = borderColor

    })

    // Apply to current weather
    const currentWeather = document.getElementById("current-weather");

    if(currentWeather){

        currentWeather.style.color = sectionColor

    }

    // Apply for open location btn
    const openLocations = document.querySelector("#open-locations")

    if(openLocations){

        openLocations.style.color = openLocationCol
        openLocations.style.borderColor = openLocationCol

    }

}