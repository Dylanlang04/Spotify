var view = 0
function playView() {
    
    if (view === 0) {
        playingView.classList.add("playView")
        playingView.classList.remove("hidden")
        const playviewWidth = playingView.getBoundingClientRect().width;
        fullscreen.style.right = `${playviewWidth + 20}px`
        view = 1
    } else {
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        fullscreen.style.right = "70px"
        view = 0 
    }


}

function updateScreenPosition() {
    if (view = 1) {
        const playviewWidth = playingView.getBoundingClientRect().width
        fullscreen.style.right = `${playviewWidth + 20}px`
    }
    
}