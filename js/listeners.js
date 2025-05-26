

function loadListeners() {
    volume.addEventListener("input", checkVol)
    home.addEventListener("click", homePage)
    lib.addEventListener("click", expandCol)
    playing_view.addEventListener("click", playView)
    browse.addEventListener("click", browsePage)
    lyric_view.addEventListener("click", lyricView)
    news.addEventListener("click", newsView)
    queue.addEventListener("click", songQueue)
    friend_act.addEventListener("click", friendActView)

    window.addEventListener("resize", updateScreenPosition)
    
}