async function loadPlaylists() {
    var playlists = await fetchPlaylists()
    playlists.forEach(playlist => {
        const btn = document.createElement('button')
        btn.className = 'playlist'
        btn.textContent = playlist.name
        pl.appendChild(btn)
    })   
    
}