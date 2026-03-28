// context menu

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

        const removeBtn = document.querySelector("#remove-city-btn")
        const moveUpBtn = document.querySelector("#move-up-btn")
        const moveDownBtn = document.querySelector("#move-down-btn")

        // remove city on button click
        removeBtn.onclick = () => {

            const index = savedLocations.findIndex(loc => loc.name === currentRightClickedLocation)

            if(index > -1){

                savedLocations.splice(index,1)
                localStorage.setItem(STORAGE_KEY, JSON.stringify({data: savedLocations, timestamp: Date.now()}))
                renderLocations(currentLocation,savedLocations,handleLocationSelect)

            }

            contextMenu.classList.add("hidden");
            currentRightClickedLocation = null

        }

        // move up
        moveUpBtn.onclick = () => {

            const index = savedLocations.findIndex(loc => loc.name === currentRightClickedLocation)

            if(index > 0){

                [savedLocations[index - 1], savedLocations[index]] = [savedLocations[index], savedLocations[index - 1]]
                localStorage.setItem(STORAGE_KEY, JSON.stringify({data: savedLocations, timestamp: Date.now()}))
                renderLocations(currentLocation,savedLocations,handleLocationSelect)

            }

            contextMenu.classList.add("hidden")
            currentRightClickedLocation = null

        }

        // move down
        moveDownBtn.onclick = () => {

            const index = savedLocations.findIndex(loc => loc.name === currentRightClickedLocation)

            if(index < savedLocations.length - 1){

                [savedLocations[index + 1], savedLocations[index]] = [savedLocations[index], savedLocations[index + 1]]
                localStorage.setItem(STORAGE_KEY, JSON.stringify({data: savedLocations, timestamp: Date.now()}))
                renderLocations(currentLocation,savedLocations,handleLocationSelect)

            }

            contextMenu.classList.add("hidden")
            currentRightClickedLocation = null

        }

        // hide / show based on position
        moveUpBtn.style.display = (savedLocations.findIndex(loc => loc.name === currentRightClickedLocation) === 0) ? "none" : "block"
        moveDownBtn.style.display = (savedLocations.findIndex(loc => loc.name === currentRightClickedLocation) === savedLocations.length - 1) ? "none" : "block"

       

    })


    // hide menu when clicking anywhere else
    document.addEventListener("click", () => {

        contextMenu.classList.add("hidden");

    })

}