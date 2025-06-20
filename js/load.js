
document.addEventListener("DOMContentLoaded", () => {
    
    if(checkToken()) {
        loadListeners()
        loadPlaylists()
        loadSong()
    }
    
})

async function checkToken() {
    const token = await window.electronAPI.getToken()

    const res = await fetch('http://localhost:3000/protected', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (res.status === 403) {
        window.location.href = '/login.html'
        return false
    }
    return true
}