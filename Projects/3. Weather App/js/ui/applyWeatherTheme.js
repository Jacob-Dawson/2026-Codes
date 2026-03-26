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

    const code = weather.code;
    const isDay = weather.isDay;

    const group = getWeatherGroup(code);
    const theme = themes[group];

    const background = isDay === 1 ? theme.day : theme.night;

    document.body.style.background = background;

    const gridSections = document.querySelectorAll("#weather-outputs > section");

    for(let i=0; i<gridSections.length; i++){

        if(isDay === 1){

            gridSections[i].style.color = "var(--col-section-day)"
            gridSections[i].style.background = "var(--bg-col-section-day)"

        } else if(isDay === 0){

            gridSections[i].style.color = "var(--col-section-night)"
            gridSections[i].style.background = "var(--bg-col-section-night)"

        }

    }

    const forecastDay = document.getElementsByClassName("forecast-day");
    const currentWeather = document.getElementById("current-weather");

    for(let i=0; i<forecastDay.length; i++){

        if(isDay === 1){

            forecastDay[i].style.color = "var(--col-section-day)"
            forecastDay[i].style.background = "var(--bg-col-section-day)"
            forecastDay[i].style.borderColor = "var(--col-section-day)"

        } else if(isDay === 0){

            forecastDay[i].style.color = "var(--col-section-night)"
            forecastDay[i].style.background = "var(--bg-col-section-night)"
            forecastDay[i].style.borderColor = "var(--border-forecastDay-col)"
            
        }

    }

    if(isDay === 1){

        currentWeather.style.color = "var(--col-section-day)"

    } else if(isDay === 0){

        currentWeather.style.color = "var(--col-section-night)"

    }
}