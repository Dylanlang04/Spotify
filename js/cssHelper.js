const search_inp = document.getElementById("search_inp")
const search_btn = document.getElementById("search_btn")

search_inp.addEventListener("mouseenter", () => {
    search_btn.classList.add("hovered")
    console.log("test")
})
search_inp.addEventListener("mouseleave", () => {
    search_btn.classList.remove("hovered")
})