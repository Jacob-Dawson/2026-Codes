let map;

export function renderWeatherMap(lat, lon){

    if(!map){

        map = L.map("weather-map-container").setView([lat,lon],12)

        // base map
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "© OpenStreetMap"
            }
        ).addTo(map)

        // precipitation radar
        L.tileLayer(
            "https://weathermaps.weatherapi.com/precip/tiles/{z}/{x}/{y}.png",
            {
                opacity: 0.6
            } 
        ).addTo(map);

    } else {

        map.setView([lat,lon],12)

    }

}