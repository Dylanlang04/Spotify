

function loadListeners() {
    volume.addEventListener("input", checkVol)
    home.addEventListener("click", homePage)
    lib.addEventListener("click", expandCol)
    playing_view.addEventListener("click", playView)

    window.addEventListener("resize", updateScreenPosition)
    
}