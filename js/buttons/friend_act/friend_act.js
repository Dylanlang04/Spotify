var view2 = 0
function friendActView() {
    
    if (view2 === 0) {
        playingView.classList.remove("playView")
        playingView.classList.add("hidden")
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        friendView.classList.remove("hidden")
        friendView.classList.add("friendView")
        const friend_actWidth = friendView.getBoundingClientRect().width;
        fullscreen.style.right = `${friend_actWidth + 20}px`
        view2 = 1
    } else {
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        deviceView.classList.add("hidden")
        deviceView.classList.remove("deviceView")
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        fullscreen.style.right = "70px"
        view2 = 0 
    }


}
