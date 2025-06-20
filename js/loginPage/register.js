const user = document.getElementById("username")
const em = document.getElementById("email")
const pnum = document.getElementById("phonenum")
const pass = document.getElementById("password")

const registerForm = document.getElementById("registerForm").addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log(registerForm)
    //window.location.href = '/phone.html'
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phonenum").value
    const password = document.getElementById("password").value
    console.log(username, email, phone, password)
    
    const response = await fetch('http://localhost:3000/register', {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, phone, password})
    })
    const result = await response.json()
    if (response.status === 200) {
        const response = await fetch('http://localhost:3000/login', {
            method: "POST",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        const result = await response.json()
        if (result.success) {
            window.electronAPI.saveToken(result.token)
            window.location.href = '/index.html'
        } else {
            alert("Login Failed: " + result.message)
        }
    } else if (result.invalid === "email") {
        alert("Email already in use.")
        em.value = ""
    } else {
        alert("Username already exists")
        user.value = ""
    }
    
})

document.addEventListener("DOMContentLoaded", () => {
})


