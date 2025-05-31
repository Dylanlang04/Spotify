function updateScreenPosition() {
    if (last != 0) {
        const width = last.getBoundingClientRect().width
        fullscreen.style.right = `${width + 20}px`
    }
    
}