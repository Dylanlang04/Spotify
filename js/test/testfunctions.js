const fetchPlaylists = async () => {
  const playlists = await window.electronAPI.getPlaylists()
  console.log(playlists)
  return playlists
}




function hideView(atr, stlye) { //no real use, more just a helper function
    atr.classList.add("hidden")
    atr.classList.remove(style)
}