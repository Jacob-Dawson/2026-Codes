export function openLocations(){

    const section = document.querySelector("#locations-section");
    if(!section) return
    section.classList.remove("hidden");

}

export function closeLocations(){

    const section = document.querySelector("#locations-section");
    if(!section) return
    section.classList.add("hidden");

}