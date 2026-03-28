export function setupContextMenu(savedLocations, renderLocations, currentLocation, STORAGE_KEY, handleLocationSelect, updateSavedLocationsOrder) {

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

    function updateLocations() {
        if (typeof updateSavedLocationsOrder === "function") {
            updateSavedLocationsOrder(savedLocations);
        }
        renderLocations(
            savedLocations.find(loc => loc.name === currentRightClickedLocation) || currentLocation,
            savedLocations,
            handleLocationSelect
        );
    }

    function getIndex() {
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

        const index = getIndex();
        moveUpBtn.style.display = index <= 0 ? "none" : "block";
        moveDownBtn.style.display = index >= savedLocations.length - 1 ? "none" : "block";
    });

    removeBtn.addEventListener("click", () => {
        const index = getIndex();
        if(index > -1){
            savedLocations.splice(index, 1);
            // pick new currentRightClickedLocation safely
            currentRightClickedLocation = savedLocations[index] ? savedLocations[index].name : savedLocations[0]?.name || null;
            updateLocations();
        }
        contextMenu.classList.add("hidden");
    });

    moveUpBtn.addEventListener("click", () => {
    const index = getIndex();
    if(index > 0){
        // swap
        [savedLocations[index - 1], savedLocations[index]] = [savedLocations[index], savedLocations[index - 1]];

        // always pick the moved item from the array itself
        currentRightClickedLocation = savedLocations[index - 1].name;

        // render the array with correct reference
        renderLocations(
            savedLocations.find(loc => loc.name === currentRightClickedLocation),
            savedLocations,
            handleLocationSelect
        );

        if (typeof updateSavedLocationsOrder === "function") {
            updateSavedLocationsOrder(savedLocations);
        }
    }
    contextMenu.classList.add("hidden");
});

moveDownBtn.addEventListener("click", () => {
    const index = getIndex();
    if(index >= 0 && index < savedLocations.length - 1){
        [savedLocations[index + 1], savedLocations[index]] = [savedLocations[index], savedLocations[index + 1]];

        currentRightClickedLocation = savedLocations[index + 1].name;

        renderLocations(
            savedLocations.find(loc => loc.name === currentRightClickedLocation),
            savedLocations,
            handleLocationSelect
        );

        if (typeof updateSavedLocationsOrder === "function") {
            updateSavedLocationsOrder(savedLocations);
        }
    }
    contextMenu.classList.add("hidden");
});

    document.addEventListener("click", () => {
        contextMenu.classList.add("hidden");
    });
}