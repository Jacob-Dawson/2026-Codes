export function setupContextMenu(getSavedLocations, renderLocations, getCurrentLocation, STORAGE_KEY, handleLocationSelect, updateSavedLocationsOrder) {

    const contextMenu = document.querySelector("#context-menu")
    const removeBtn = document.querySelector("#remove-city-btn")
    const moveUpBtn = document.querySelector("#move-up-btn")
    const moveDownBtn = document.querySelector("#move-down-btn")
    const savedContainer = document.querySelector("#saved-locations-container")

    if(!contextMenu || !removeBtn || !moveUpBtn || !moveDownBtn || !savedContainer){
        console.error("Context menu setup failed: missing DOM element(s)")
        return
    }

    let currentRightClickedLocation = null;


    function getIndex(savedLocations) {
        return savedLocations.findIndex(loc => loc.name === currentRightClickedLocation);
    }

    document.addEventListener("contextmenu", (e) => {
        const card = e.target.closest(".location-card");
        if(!card || !savedContainer.contains(card)){
            contextMenu.classList.add("hidden");
            return;
        }

        e.preventDefault();
        currentRightClickedLocation = card.dataset.name;

        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.classList.remove("hidden");

        const savedLocations = getSavedLocations();
        const index = getIndex(savedLocations);
        moveUpBtn.style.display = index <= 0 ? "none" : "block";
        moveDownBtn.style.display = index >= savedLocations.length - 1 ? "none" : "block";
    });

    removeBtn.addEventListener("click", () => {
        const savedLocations = getSavedLocations()
        const index = getIndex(savedLocations);
        if(index > -1){
            savedLocations.splice(index, 1);
            // pick new currentRightClickedLocation safely
            currentRightClickedLocation = savedLocations[index]?.name ?? savedLocations[0]?.name ?? null;
            updateSavedLocationsOrder(savedLocations)
            renderLocations();
        }
        contextMenu.classList.add("hidden");
    });

    moveUpBtn.addEventListener("click", () => {
        const savedLocations = getSavedLocations()
        const index = getIndex(savedLocations);
        if(index > 0){
            // swap
            [savedLocations[index - 1], savedLocations[index]] = [savedLocations[index], savedLocations[index - 1]];
            updateSavedLocationsOrder(savedLocations)
            renderLocations()
        }
        contextMenu.classList.add("hidden");
    });

    moveDownBtn.addEventListener("click", () => {
        const savedLocations = getSavedLocations()
        const index = getIndex(savedLocations);
        if(index >= 0 && index < savedLocations.length - 1){
            [savedLocations[index + 1], savedLocations[index]] = [savedLocations[index], savedLocations[index + 1]];
            updateSavedLocationsOrder(savedLocations)
            renderLocations()
        }
        contextMenu.classList.add("hidden");
    });

    document.addEventListener("click", () => {
        contextMenu.classList.add("hidden");
    });
}