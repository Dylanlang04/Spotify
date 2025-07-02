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
    let track = null
    if (getVal('spotify_track_id')) {
        const response = await fetch(`http://localhost:3000/api/admin/song/track/${getVal('spotify_track_id')}`)
        track = await response.json()
    } else {
        const response = await fetch(`http://localhost:3000/api/admin/cover/${getVal('title')}/${getVal('main_artist')}`)
        const result1 = await response.json()
        track = result1.track.track
    }


        let main_artist = {}
        let album = {}

        album['album_type'] = track.album.album_type
        album['album_id'] = track.album.id
        album['images'] = track.album.images
        album['name'] = track.album.name
        album['release_date'] = track.album.release_date
        album['total_tracks'] = track.album.total_tracks
        album['type'] = track.album.type
        let album_artists = []
        for (let i = 0; i < track.album.artists.length; i++) {
            let artist = {}
            artist['id'] = track.album.artists[i].id
            artist['name'] = track.album.artists[i].name
            artist['type'] = track.album.artists[i].type
            album_artists[i] = artist
        }
        album['artists'] = album_artists
        jsonObject['album'] = album

        main_artist['name'] = track.artists[0].name
        main_artist['artist_id'] = track.artists[0].id
        main_artist['type'] = track.artists[0].type
        jsonObject['main_artist'] = main_artist

        if (track.artists.length > 1) {
            let artists = []
            for (let i = 0; i < track.artists.length - 1; i++) {
                let artist = {}
                artist['id'] = track.artists[1 + i].id
                artist['name'] = track.artists[1+i].name
                artist['type'] = track.artists[1+i].type 
                artists[i]   
            }
            jsonObject['featured_artists'] = artists
        } 
        jsonObject['title'] = track.name
        jsonObject['track_id'] = track.id
        jsonObject['popularity'] = track.popularity
        jsonObject['isrc'] = track.external_ids.isrc
        jsonObject['explicit'] = track.explicit
        jsonObject['duration_ms'] = track.duration_ms
        jsonObject['disc_num'] = track.disc_number
        jsonObject['release_date'] = track.album.release_date
        jsonObject['images'] = track.album
        jsonObject['track_number'] = track.track_number
        jsonObject['type'] = track.type
        
        console.log(track)
        console.log(jsonObject)
        let fields =['genre', 'producer', 'writer', 'performer', 'lyrics_url', 'key']
        fields.forEach(field => {
            const val = getVal(field)
            jsonObject[field] = val
        })

        let numFields = ['total_plays', 'skip_rate', 'like_count', 'bpm']
        numFields.forEach(field => {
            const val = parseNumber(getVal(field))
            jsonObject[field] = val
        })


        
        /* 
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
        const track = result1.track.track

        jsonObject['spotify_track_id'] = result1.spotify_track_id
        jsonObject['cover_image_url'] = result1.cover_image_url
        
    
    
        formData.append('metadata', JSON.stringify(jsonObject))
      //  const res = await fetch('http://localhost:3000/api/admin/upload', {
      //      method: "POST",
      //      body: formData,
      //  })
        */
})

document.getElementById("back").addEventListener("click", ()=>{
    window.location.href = '/index.html'
})



document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("http://localhost:3000/api/admin/songs")
    const result = await res.json()
    
})