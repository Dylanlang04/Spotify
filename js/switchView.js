
function switchView(atr, style) {
    if (last === atr) {
        atr.classList.add("hidden")
        atr.classList.remove(style)
        fullscreen.style.right = "70px"
        last = 0
    } else {
        if(last != 0) {
            last.classList.add("hidden")
            last.classList.remove(lastStyle)
        }
        
        atr.classList.remove("hidden")
        atr.classList.add(style)
        const atrWidth = atr.getBoundingClientRect().width;
        fullscreen.style.right = `${atrWidth + 20}px`
        last = atr
        lastStyle = style
    }
    

}
