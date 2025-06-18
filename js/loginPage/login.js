document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()
  const email = e.target.email.value
  const password = e.target.password.value

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const result = await response.json()

  if (result.success) {
    window.electronAPI.saveToken(result.token)
    window.location.href = '/index.html'
    
  } else {
    alert('Login failed: ' + result.message)
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
    }
}

