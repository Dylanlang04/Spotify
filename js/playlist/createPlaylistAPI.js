async function createPlaylistServer() {
    const token = await window.electronAPI.getToken()
    const response = await fetch(`http://localhost:3000/api/playlist/create/${token}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            token: token
        })
    })
    console.log(response.status)
}
async function serverplaylists() {
    const token = window.electronAPI.getToken()
    const response = await fetch(`http://localhost:3000/api/playlists/${token}`)
}

const createPlaylistLocal = async () => {
  const res = await window.electronAPI.addPlaylist({
    name: "Lo-Fi Mix",
    description: "Chill lo-fi beats"
  })
  console.log("Added playlist ID:", res.id)
}