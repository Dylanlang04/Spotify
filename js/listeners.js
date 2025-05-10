const volume = document.getElementById("volumeSlider")
function loadListeners() {
    volume.addEventListener("input", checkVol)
}