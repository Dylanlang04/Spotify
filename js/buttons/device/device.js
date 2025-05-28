var view3 = 0
function devicesView() {
    if (view3 === 0) {
        deviceView.classList.add("deviceView")
        deviceView.classList.remove("hidden")
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        const deviceWidth = deviceView.getBoundingClientRect().width;
        fullscreen.style.right = `${deviceWidth + 20}px`
        view3 = 1
    } else {
        deviceView.classList.add("hidden")
        deviceView.classList.remove("deviceView")
        playingView.classList.add("hidden")
        playingView.classList.remove("playView")
        queueView.classList.add("hidden")
        queueView.classList.remove("queueView")
        friendView.classList.add("hidden")
        friendView.classList.remove("friendView")
        fullscreen.style.right = "70px"
        view3 = 0 
    }
}