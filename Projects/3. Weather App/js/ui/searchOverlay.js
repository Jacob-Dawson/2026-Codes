// Displays the search overlay

export function openSearchOverlay(){

    document.querySelector("#search-overlay").classList.remove("hidden");

}

export function closeSearchOverlay(){

    document.querySelector("#search-overlay").classList.add("hidden");

}