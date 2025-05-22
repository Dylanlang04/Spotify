

function loadListeners() {
    volume.addEventListener("input", checkVol)
    home.addEventListener("click", homePage)
    lib.addEventListener("click", expandCol)
    playing_view.addEventListener("click", playView)
    browse.addEventListener("click", browsePage)

    window.addEventListener("resize", updateScreenPosition)
    
}