const submit = document.getElementById("submit")
const form = document.getElementById("upload")
const fileinp = document.getElementById("file")


submit.addEventListener("click", async (e) => {
    e.preventDefault()

    const files = fileinp.files

     if (!files.length) {
        alert("No file selected.")
        return
    }

    const formData = new FormData()
    formData.append("file", files[0])
    const res = await fetch('http://localhost:3000/api/admin/upload', {
        method: "POST",
        body: formData,
    })
    const result = await res.json()
    console.log(result)
})

document.getElementById("back").addEventListener("click", ()=>{
    window.location.href = '/index.html'
})