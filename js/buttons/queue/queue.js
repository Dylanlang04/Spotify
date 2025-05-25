var view1 =0

function songQueue() {
    if (view1 === 0) {
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        queueView.classList.remove("hidden")
        queueView.classList.add("queueView")
        
        const queueWidth = queueView.getBoundingClientRect().width;
        fullscreen.style.right = `${queueWidth + 20}px`
        view1 = 1
        
    } else {
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        fullscreen.style.right = "70px"
        view1 = 0
    }
    

}


