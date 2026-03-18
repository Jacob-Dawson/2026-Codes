// data layer of the project (location service)

const API_KEY = "68894964541e4fa1ac9204510260503"
const BASE_URL = "https://api.weatherapi.com/v1"

export async function searchLocations(query){

    const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
    )

    if(!response.ok){

        throw new Error("Location search failed")

    }

    return response.json()

}