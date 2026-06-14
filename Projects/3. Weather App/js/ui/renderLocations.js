// renders the locations overlay

export function createLocationCard(location){

    if(!location){

        return `<div class="location-card">Invalid location</div>`

    }

    const name = location.name ?? "Unknown"
    const icon = location.condition?.icon ?? ""
    const conditionText = location.condition?.text ?? "Unavailable"
    const temp = location.temp?.temp ?? null
    const tempMax = location.temp?.tempMax ?? null
    const tempMin = location.temp?.tempMin ?? null

    const coordsAttrs = (location.lat != null && location.lon != null)
        ? `data-lat="${location.lat}" data-lon="${location.lon}"`
        : ""

    return `
        <div class="location-card" data-name="${name}" ${coordsAttrs}>
            <div>
                <img src="${icon}" alt="${conditionText}">
            </div>
            <div>
                <h4>${name}</h4>
                <p>${conditionText}</p>
                <p>${tempMax != null ? Math.round(tempMax) : "--"}° ${tempMin != null ? Math.round(tempMin) : "--"}°</p>
            </div>
            <div>
                <span>${temp != null ? Math.round(temp) : "--"}°</span>
            </div>
        </div>`

}

export function renderLocations(current,saved,onSelectLocation){

    const currentContainer = document.querySelector("#current-location-container")
    const savedContainer = document.querySelector("#saved-locations-container")

    // guard clauses
    if(!currentContainer || !savedContainer){

        console.error("renderLocations: container missing")
        return

    }

    // current location
    
    currentContainer.innerHTML = `<h3>Current Location</h3>`
    
    if(current && current.name){

        currentContainer.innerHTML += createLocationCard(current)
        
        const currentCard = currentContainer.querySelector(".location-card")

        if(currentCard){

            currentCard.addEventListener("click", () => {

                if(onSelectLocation) onSelectLocation(current.lat, current.lon, current.name)

            })

        }

    } else {

        currentContainer.innerHTML += "<p>No current location</p>"

    }


    // saved locations
    //const savedContainer = document.querySelector("#saved-locations-container")
    
    savedContainer.innerHTML = `<h3>Saved Locations</h3>`

    // safe array handling
    const validSaved = Array.isArray(saved)
        ? saved.filter(loc => loc && loc.name)
        : []

    if(validSaved.length > 0){

        savedContainer.innerHTML += validSaved.map(createLocationCard).join("")

    } else {

        savedContainer.innerHTML += "<p>No saved locations</p>"

    }

    // Add click listeners for saved locations
    const cards = savedContainer.querySelectorAll(".location-card")

    cards.forEach(card => {

        card.addEventListener("click", () => {

            const { name, lat, lon } = card.dataset

            if(name){

                onSelectLocation(lat, lon, name)

            }
        })

    })

}