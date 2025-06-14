async function loadPlaylists() {
    var playlists = await fetchPlaylists()
    playlists.forEach(playlist => {
        pl.innerHTML += `<button class="playlist">${playlist.name}</button>`
    })   
    
}