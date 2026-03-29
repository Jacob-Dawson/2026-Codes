Weather App Checklist
---------------------------------

Architecture:

3. Weather App/
|
|-- index.html
|
|-- css/
|   |-- base.css
|
|-- js/
    |-- base.js
    |
    |-- api/
    |   |-- weatherService.js
    |
    |-- ui/
    |   |-- renderCurrentWeather.js
    |   |-- renderForecast.js
    |   |-- renderAstronomy.js
    |
    |-- utils/
        |-- formatData.js

Data Flow:

- API (weatherService.js)
to
- Data formatting (formatData.js)
to
- UI rendering (renderCurrentWeather.js, renderForecast.js, renderAstronomy.js)
to
- Controller (main.js)

Key:

✅ = Done
✅✅ = Done with css
✅✅✅ = Done and perfect

Goals:

✅ - Location / City search
✅ - Location autocomplete
✅ - Geolocation
✅ - Current weather
✅ - Hourly temperature / weather chart (next 24hr) [chart.js?]
✅ - 3 day forecast
✅ - Air quality Index
✅ - UV Index
✅ - Sunrise / Sunset display
✅ - Moon phase

Distant Goals:

- Severe weather alerts / warnings
- Background changes due to night or day [is_day]
- Pollen [pollen element]
- Astrology revamp (use astro element)
- Air quality revamp (use gb-defra-index from air_quality element)
- Hourly forecast for each day
- Feels like temp [feelslike_c, feelslike_f]
- Precipitation chance hourly and daily in forecasts (in %) [daily_chance_of_rain] [daily_chance_of_snow] [daily_will_it_rain] [daily_will_it_snow]
- wind speed and direction? [wind_dir, wind_mph / wind_kph]
- Weather maps (Precipitation) [https://weathermaps.weatherapi.com/precip/tiles/{0}{1}/{z}/{x}/{y}.png]
{0} is UTC Date in yyyyMMdd format. E.g: 1st Nov 2025 will be 20251101.
{1} is UTC hour in 24 format. E.g:- 1 am will be 01. 6 pm will be 18.
{z} is zoom level
{x} is x-tile coordinate
{y} is y-tile coordinate