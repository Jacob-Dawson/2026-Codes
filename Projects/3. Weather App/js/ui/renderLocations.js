// renders the locations overlay

export function createLocationCard(location){

    return `
        <div class="location-card" data-name="${location.name}">
            <h4>${location.name}</h4>
            <p>${location.condition.text}</p>
            <img src="${location.condition.icon}" alt="${location.condition.text}">
            <span>${location.temp_c}°</span>
        </div>`

}

export function renderLocations(current,saved,onSelectLocation){

    // current location
    const currentContainer = document.querySelector("#current-location-container")
    if(currentContainer && current && current.name){

        currentContainer.innerHTML = createLocationCard(current)
        
        const currentCard = currentContainer.querySelector(".location-card")

        if(currentCard){

            currentCard.addEventListener("click", () => {

                if(onSelectLocation) onSelectLocation(current.name)

            })

        }

    } else if(currentContainer) {

        currentContainer.innerHTML = "<p>No current location</p>"

    }


    // saved locations
    const savedContainer = document.querySelector("#saved-locations-container")
    
    if(savedContainer){
        
        const validSaved = saved.filter(loc => loc && loc.name)

        if(validSaved.length > 0){

            savedContainer.innerHTML = validSaved.map(createLocationCard).join("")

        } else {

            savedContainer.innerHTML = "<p>No saved locations</p>"

        }

        // Add click listeners for saved locations
        const cards = savedContainer.querySelectorAll(".location-card")

        cards.forEach(card => {

            card.addEventListener("click", () => {

                const locationName = card.dataset.name

                if(onSelectLocation){

                    onSelectLocation(locationName)

                }
            })

        })

    }

    console.log("Locations rendered", {current, saved})

}