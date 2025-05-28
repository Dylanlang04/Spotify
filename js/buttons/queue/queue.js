var view1 =0

function songQueue() {
    if (view1 === 0) {
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        queueView.classList.remove("hidden")
        queueView.classList.add("queueView")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        const queueWidth = queueView.getBoundingClientRect().width;
        fullscreen.style.right = `${queueWidth + 20}px`
        view1 = 1
        
    } else {
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        deviceView.classList.add("hidden")
        deviceView.classList.remove("deviceView")
        fullscreen.style.right = "70px"
        view1 = 0
    }
    

}


