const submit = document.getElementById("submit")
const form = document.getElementById("upload")
const fileinp = document.getElementById("file")

function parseCSV(input) {
    
    if (!input) return []
    return input.split(',').map(s => s.trim()).filter(Boolean)
}
function getVal(name) {
    const val = form.elements[name].value.trim()
    return val === '' ? null : val
}
function parseNumber(input) {
  if (!input) return null;
  const n = Number(input);
  return isNaN(n) ? null : n;
}




submit.addEventListener("click", async (e) => {
    e.preventDefault()

    const files = fileinp.files

     if (!files.length) {
        //alert("No file selected.")
        //return
    }
    const jsonObject = {}
    if (getVal('spotify_track_id')) {
        const responsetrack = await fetch(`http://localhost:3000/api/admin/song/track/${getVal('spotify_track_id')}`)
        const resulttrack = await responsetrack.json()
        let main_artist = {}
        let album = {}
        album['album_type'] = resulttrack.data.album.album_type
        album['id'] = resulttrack.data.album.id
        album['images'] = resulttrack.data.album.images
        album['name'] = resulttrack.data.album.name
        album['release_date'] = resulttrack.data.album.release_date
        album['total_tracks'] = resulttrack.data.album.total_tracks
        album['type'] = resulttrack.data.album.type
        let album_artists = []
        for (let i = 0; i < resulttrack.data.album.artists.length; i++) {
            let artist = {}
            artist['id'] = resulttrack.data.album.artists[i].id
            artist['name'] = resulttrack.data.album.artists[i].name
            artist['type'] = resulttrack.data.album.artists[i].type
            album_artists[i] = artist
        }
        album['artists'] = album_artists
        jsonObject['album'] = album
    
        main_artist['id'] = resulttrack.data.artists[0].id
        main_artist['name'] = resulttrack.data.artists[0].name
        main_artist['type'] = resulttrack.data.artists[0].type
        jsonObject['main_artist'] = main_artist
        

        if (resulttrack.data.artists.length > 1) {
            let artists = []
            for (let i = 0; i < resulttrack.data.artists.length - 1; i++) {
                let artist = {}
                artist['id'] = resulttrack.data.artists[1 + i].id
                artist['name'] = resulttrack.data.artists[1+i].name
                artist['type'] = resulttrack.data.artists[1+i].type 
                artists[i]   
            }
            jsonObject['featured_artists'] = artists
        } 
        jsonObject['title'] = resulttrack.data.name
        jsonObject['spotify_track_id'] = resulttrack.data.id
        jsonObject['popularity'] = resulttrack.data.popularity
        jsonObject['isrc'] = resulttrack.data.external_ids.isrc
        jsonObject['explicit'] = resulttrack.data.explicit
        jsonObject['duration_ms'] = resulttrack.data.duration_ms
        jsonObject['disc_num'] = resulttrack.data.disc_number
        jsonObject['release_date'] = resulttrack.data.album.release_date
        jsonObject['images'] = resulttrack.data.album.images

        console.log(resulttrack)
        console.log(jsonObject)
        
    } else { // this needs to be of the same form above. should auto fill null data or known data. ie search by artist/title. then by spotify id. fill in known info. then add the user inputted info
        jsonObject.title = getVal('title')
        jsonObject.main_artist = getVal('main_artist')
        jsonObject.featured_artists = parseCSV(getVal('featured_artists'))
        let fields =['album', 'genre', 'producer', 'writer', 'performer', 'key', 'isrc_code', 'artist_id', 'spotify_track_id', 'lyrics_url', 'cover_image_url']
        fields.forEach(field => {
            const val = getVal(field)
            jsonObject[field] = val
        })
        let numFields = ['duration_ms', 'popularity', 'total_plays', 'skip_rate', 'like_count', 'bpm']
        numFields.forEach(field => {
            const val = parseNumber(getVal(field))
            jsonObject[field] = val
        })

        const explicitVal = getVal('explicit')
        if (explicitVal === 'true') {
            jsonObject.explicit = true
        } else if (explicitVal === 'false') {
            jsonObject.explicit = false
        }

        const formData = new FormData()
        formData.append("file", files[0])

        formData.forEach((value, key) => {

            if (value === 'true') {
              jsonObject[key] = true
            } else if (value === 'false') {
              jsonObject[key] = false
            } else if (!isNaN(value) && value.trim() !== '') {
              jsonObject[key] = Number(value)
            } else {
              jsonObject[key] = value.trim()
            }
        })
        const response = await fetch(`http://localhost:3000/api/admin/cover/${jsonObject.title}/${jsonObject.main_artist}`)
        const result1 = await response.json()
        jsonObject['spotify_track_id'] = result1.spotify_track_id
        jsonObject['cover_image_url'] = result1.cover_image_url
        console.log(result1.spotify_track_id)
    
    
        formData.append('metadata', JSON.stringify(jsonObject))
      //  const res = await fetch('http://localhost:3000/api/admin/upload', {
      //      method: "POST",
      //      body: formData,
      //  })
        const result = await res.json()
        console.log(result)
    }

    
    
})

document.getElementById("back").addEventListener("click", ()=>{
    window.location.href = '/index.html'
})



document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("http://localhost:3000/api/admin/songs")
    const result = await res.json()
    
})