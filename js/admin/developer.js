document.getElementById("developer").addEventListener("click",  async () => {
    const token = await window.electronAPI.getToken()
    const response = await fetch(`http://localhost:3000/api/admin/${token}`)
    const result = await response.json()
    if (result.user.perms === 'admin') {
        window.location.href ='/admin.html'
    }


})

