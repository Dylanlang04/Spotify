document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()
  const email = e.target.email.value
  const password = e.target.password.value

  const response = await fetch('http://localhost:3000/api/account/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const result = await response.json()

  if (result.success) {
    window.electronAPI.saveToken(result.token)
    window.electronAPI.createDb()
    window.location.href = '/index.html'
    const playlists = window.electronAPI.syncDb()
    console.log(playlists)
    
  } else {
    alert('Login failed: ' + result.message)
  }
})



