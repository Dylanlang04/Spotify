function loadSong() {
    fetch('http://localhost:3000/api/song/1.mp3')
  .then(response => response.json())
  .then(data => {
    console.log("loasded")
    const signedUrl = data.url
    player.src = signedUrl
    console.log('Signed URL:', signedUrl)
  })
}