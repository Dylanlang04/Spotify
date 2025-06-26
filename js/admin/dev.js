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
        jsonObject['album'] = resulttrack.data.album.name
        jsonObject['main_artist'] = resulttrack.data.artists[0]
        if (resulttrack.data.artists.length > 1) {
            let artists = []
            for (let i = 0; i < resulttrack.data.artists.length - 1; i++) {
                artists[i] = resulttrack.data.artists[1 + i]    
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
        
        if (resulttrack.data.album.images.length > 0) {
            let images = []
            for (let i = 0; i < resulttrack.data.album.images.length; i++) {
                images[i] = resulttrack.data.album.images[i]
            }
            jsonObject['images'] = images
        } 
        

        

        console.log(resulttrack)
        console.log(jsonObject)
        
    } else {
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
        const res = await fetch('http://localhost:3000/api/admin/upload', {
            method: "POST",
            body: formData,
        })
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