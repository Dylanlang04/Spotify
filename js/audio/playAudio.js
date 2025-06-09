var playcheck = 0
function toggleAudio() {
    if (playcheck === 0) {
        player.play()
        playcheck = 1
    } else {
        player.pause()
        playcheck = 0
    }
}