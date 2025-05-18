

function loadListeners() {
    volume.addEventListener("input", checkVol)
    home.addEventListener("click", homePage)
    lib.addEventListener("click", expandCol)
}