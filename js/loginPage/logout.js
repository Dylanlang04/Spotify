function logout() {
    window.electronAPI.deleteToken()
    window.location.href = "/login.html"
}