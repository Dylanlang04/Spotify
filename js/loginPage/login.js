document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()
  const email = e.target.email.value
  const password = e.target.password.value

  const response = await fetch('https://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const result = await response.json()

  if (result.success) {
    //load index.html
    
  } else {
    alert('Login failed: ' + result.message)
  }
})


function checkLogin() {
    loginPage()
}