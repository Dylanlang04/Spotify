

function loadListeners() {
    volume.addEventListener("input", checkVol)
    home.addEventListener("click", homePage)
    lib.addEventListener("click", expandCol)
    playing_view.addEventListener("click", playView)
    browse.addEventListener("click", browsePage)
    lyric_view.addEventListener("click", lyricView)
    news.addEventListener("click", newsView)

    window.addEventListener("resize", updateScreenPosition)
    
}