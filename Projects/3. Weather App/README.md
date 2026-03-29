# 🌤️ Weather App

A mobile-first weather application that provides real-time weather data, forecasts, and location management using the WeatherAPI.

---

## Features

- **Current Weather** — Live temperature, condition, feels like, and daily high/low
- **Hourly Forecast** — Next 24 hours of weather with temperature and rain chance
- **3-Day Forecast** — Daily forecast cards with condition icons
- **Precipitation** — Current precipitation levels
- **Wind** — Speed and direction
- **Health Info** — UV index and air quality (GB DEFRA index)
- **Astronomy** — Sunrise, sunset, moon phase and illumination
- **Weather Map** — Interactive Leaflet map with precipitation radar overlay
- **Weather Alerts** — Displays active weather warnings if present
- **Dynamic Theming** — Background gradient changes based on weather condition and time of day
- **Location Management** — Save, reorder, and remove locations via a right-click context menu
- **Search** — Search and add new locations
- **GPS Support** — Automatically loads weather for your current location on startup
- **Loader Transition** — Smooth fade-in/out loading screen

---

## Project Structure

```
Weather App/
├── css/
│   └── base.css              # All styles, mobile-first with desktop breakpoint
├── js/
│   ├── base.js               # Main controller — wires API to UI
│   ├── api/
│   │   ├── weatherService.js # Fetches weather data from WeatherAPI
│   │   └── locationService.js# Fetches location search results
│   ├── ui/
│   │   ├── applyWeatherTheme.js
│   │   ├── contextMenu.js
│   │   ├── locationsSection.js
│   │   ├── renderAlerts.js
│   │   ├── renderAstronomy.js
│   │   ├── renderCurrentWeather.js
│   │   ├── renderForecast.js
│   │   ├── renderForecastHour.js
│   │   ├── renderHealth.js
│   │   ├── renderLocations.js
│   │   ├── renderPrecipitation.js
│   │   ├── renderWeatherMap.js
│   │   ├── renderWind.js
│   │   └── searchOverlay.js
│   └── utils/
│       └── formatData.js     # Formatting helpers for temps, wind, dates etc.
└── index.html
```

---

## Getting Started

### Prerequisites

- A modern browser with ES module support
- A local dev server (e.g. VS Code Live Server, or `npx serve`)

> Opening `index.html` directly via `file://` will not work due to ES module CORS restrictions.

### Setup

1. Clone or download the repository
2. Open the project in your editor
3. Serve it with a local dev server
4. Allow location access when prompted in the browser

---

## API

This app uses [WeatherAPI](https://www.weatherapi.com/).

- Forecast endpoint: `/v1/forecast.json` (3 days, AQI, alerts)
- Search endpoint: `/v1/search.json`

> ⚠️ The API key is currently exposed in client-side JavaScript. For any public deployment, route requests through a backend proxy or serverless function instead.

---

## Caching

Saved location weather data is cached in `localStorage` for **10 minutes** to reduce unnecessary API calls. The cache is keyed as `savedLocationsWeather`.

---

## Built With

- Vanilla JavaScript (ES Modules)
- [WeatherAPI](https://www.weatherapi.com/) — weather data
- [Leaflet.js](https://leafletjs.com/) — interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) — map tiles
- [Google Fonts — Montserrat](https://fonts.google.com/specimen/Montserrat)
