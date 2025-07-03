const jwt = require('jsonwebtoken')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const jwt_secret = process.env.JWTSECRET
const clientId = process.env.SPOTIFYCLIENT
const clientSecret = process.env.SPOTIFYSECRET

const s3Client = new S3Client({
  region: 'auto', 
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  
  const token = authHeader?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

async function generateSignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: 'spotifymusic',
    Key: key,
    
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 500 });

  return signedUrl;
}


async function getSpotifyAccessToken() {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + creds,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  })

  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }
  return data.access_token
}


async function searchSpotifyTrack(title, artist, accessToken) {
  const query = `${encodeURIComponent(title)} artist:${encodeURIComponent(artist)}`
  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const data = await res.json()
  const track = data.tracks.items[0]
  

  if (!track) return null

  return {
    track
  }
}

async function searchExactSpotifyTrack(title, artist, accessToken) {
  const query = `track:${title} artist:${artist}`
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const data = await res.json()
  const tracks = data.tracks.items

  if (!tracks || tracks.length === 0) return null
  const exactMatch = tracks.find(track =>
    track.name.toLowerCase() === title.toLowerCase()
  )

  return {
    track: exactMatch || tracks[0] 
  }
}



module.exports = {
  authenticateToken,
  generateSignedUrl,
  getSpotifyAccessToken,
  searchSpotifyTrack,
  searchExactSpotifyTrack
}