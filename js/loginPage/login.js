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
    localStorage.setItem('authToken', result.token)
    window.location.href = '/index.html'
    //load index.html
    
  } else {
    alert('Login failed: ' + result.message)
  }
})


function checkLogin() {
    loginPage()
}