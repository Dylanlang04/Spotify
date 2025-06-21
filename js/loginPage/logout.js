function logout() {
    window.electronAPI.deleteToken()
    //window.electronAPI.logoutDb()
    window.location.href = "/login.html"
}