

function loadListeners() {
    home.addEventListener("click", homePage)
    lib.addEventListener("click", expandCol)
    browse.addEventListener("click", browsePage)
    lyric_view.addEventListener("click", lyricView)
    news.addEventListener("click", newsView)
    vol_btn.addEventListener("click", clickVolume)
    playing_view.addEventListener("click", () => switchView(playingView, "playView"))
    queue.addEventListener("click", () => switchView(queueView, "queueView"))
    friend_act.addEventListener("click", () => switchView(friendView, "friendView"))
    devicebtn.addEventListener("click", () => switchView(deviceView, "deviceView"))
    play_btn.addEventListener("click", toggleAudio)
    liked_pl.addEventListener("click", likedPl)
    fwd_btn.addEventListener("click", fetchPlaylists)
    bck_btn.addEventListener("click", () => {
        
        window.electronAPI.deletePlaylist(2)
    })   
    create_pl.addEventListener("click", createPlaylistServer)
    shuffle.addEventListener("click", logout)
    window.addEventListener("resize", updateScreenPosition)
    
}