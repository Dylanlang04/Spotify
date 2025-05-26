var view = 0
function playView() {
    
    if (view === 0) {
        playingView.classList.add("playView")
        playingView.classList.remove("hidden")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        const playviewWidth = playingView.getBoundingClientRect().width;
        fullscreen.style.right = `${playviewWidth + 20}px`
        view = 1
    } else {
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        fullscreen.style.right = "70px"
        view = 0 
    }


}

