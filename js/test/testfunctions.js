const fetchPlaylists = async () => {
  const playlists = await window.electronAPI.getPlaylists()
  console.log(playlists)
  return playlists
}


const createPlaylist = async () => {
  const res = await window.electronAPI.addPlaylist({
    name: "Lo-Fi Mix",
    description: "Chill lo-fi beats"
  })
  console.log("Added playlist ID:", res.id)
}

function hideView(atr, stlye) { //no real use, more just a helper function
    atr.classList.add("hidden")
    atr.classList.remove(style)
}