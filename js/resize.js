function updateScreenPosition() {
    if (view === 1) {
        const playviewWidth = playingView.getBoundingClientRect().width
        fullscreen.style.right = `${playviewWidth + 20}px`
    } else if (view1 === 1) {
        const queueWidth = queueView.getBoundingClientRect().width
        fullscreen.style.right = `${queueWidth + 20}px`
    } else if (view2 === 1) {
        const friendWidth = friendView.getBoundingClientRect().width
        fullscreen.style.right = `${friendWidth + 20}px`
    } else if (view3 === 1) {
        const deviceWidth = deviceView.getBoundingClientRect().width
        fullscreen.style.right = `${deviceWidth + 20}px`
    }

    
}