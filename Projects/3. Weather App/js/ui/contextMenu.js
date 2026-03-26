// context menu

//import { renderLocations } from "./renderLocations";

export function setupContextMenu(savedLocations,renderLocations,currentLocation, STORAGE_KEY, handleLocationSelect){

    const contextMenu = document.querySelector("#context-menu")
    let currentRightClickedLocation = null;

    // Listen for right clicks on saved location cards
    document.addEventListener("contextmenu", (e) => {

        const card = e.target.closest(".location-card")

        if(!card){

            contextMenu.classList.add("hidden")
            return // only triggers for location cards

        }

        // only allow removing saved locations
        if(!document.querySelector("#saved-locations-container").contains(card)) return

        e.preventDefault() // prevent browser context menu

        currentRightClickedLocation = card.dataset.name

        // position the menu near cursor
        contextMenu.style.top = e.pageY + "px"
        contextMenu.style.left = e.pageX + "px"
        contextMenu.classList.remove("hidden")

    })


    // hide menu when clicking anywhere else
    document.addEventListener("click", () => {

        contextMenu.classList.add("hidden");

    })

    // remove city on menu click
    const removeBtn = document.querySelector("#remove-city-btn")
    removeBtn.addEventListener("click", () => {

        if(!currentRightClickedLocation) return

        // remove from savedLocations
        const index = savedLocations.findIndex(loc => loc.name === currentRightClickedLocation)
        if(index > -1){

            savedLocations.splice(index,1)

        }

        // update localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            data: savedLocations,
            timestamp: Date.now()
        }))

        // re-render overlay
        renderLocations(currentLocation,savedLocations,handleLocationSelect)

        contextMenu.classList.add("hidden")
        currentRightClickedLocation = null

    })

}