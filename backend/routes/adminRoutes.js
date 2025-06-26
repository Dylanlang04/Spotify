const express = require('express')
const router = express.Router()
const { authenticateToken, generateSignedUrl } = require('../utils/utils')
const { Client } = require('pg')
const jwt = require('jsonwebtoken')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const upload = multer()
const mm = require('music-metadata')
const fs = require('fs')
const clientId = process.env.SPOTIFYCLIENT
const clientSecret = process.env.SPOTIFYSECRET
const jwt_secret = process.env.JWTSECRET

const s3Client = new S3Client({
  region: 'auto', 
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.GODACCESS,
    secretAccessKey: process.env.GODSECRET,
  },
})



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
    spotify_track_id: track.id,
    cover_image_url: track.album.images[0]?.url || null
  }
}

router.get('/cover/:title/:artist', async (req, res) => {
    const token = await getSpotifyAccessToken()
    const {title, artist} = req.params
    const {spotify_track_id, cover_image_url} = await searchSpotifyTrack(title, artist, token)
    return res.json({spotify_track_id, cover_image_url})
})
const trackId = '7ouMYWpwJ422jRcDASZB7P'


router.get('/song/track/:trackid', async (req, res) => {
  
  const trackid = req.params.trackid
  const url = `https://api.spotify.com/v1/tracks/${trackid}`
  const token = await getSpotifyAccessToken()
  console.log(token)
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ` + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  })
  if (!response.ok) {
    const errorData = await response.json()
    console.error('Spotify API error:', errorData)
    return res.status(response.status).json(errorData)
  }
  const data = await response.json()
  return res.json({data})
})


router.get('/users', async (req, res) => {
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  })
  console.log("Hello from frontend")
  await client.connect()
  const result = await client.query('SELECT * FROM users')
  await client.end()
  res.json(result.rows)
})
router.get('/:token', async (req,res) => {
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  })
  const token = req.params.token
  jwt.verify(token, jwt_secret, async (err, decoded) => {
    
    if (err) {
      return res.status(404).json({message: "error"})
    } else {
      const userId = decoded.userId
      client.connect()
      const result = await client.query("SELECT * FROM users WHERE id = $1 AND perms = $2", [userId, 'admin'])
      client.end()
      res.json({user: result.rows[0]})
    }
  } )


})
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file
  const metadata = JSON.parse(req.body.metadata)
  if (!file) return res.status(400).send('No file uploaded.')

  const command = new PutObjectCommand({
    Bucket: 'spotifymusic',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  })
  

  try {
    await s3Client.send(command)
    res.json({ message: 'File uploaded successfully!' })
  } catch (err) {
    console.error('Upload failed:', err)
    res.status(500).json({message: "upload failed"})
  }
})

router.get("/songs", async (req, res) => {
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  })
  client.connect()
  const result = await client.query("SELECT * FROM tracks")
  client.end()
  res.json({songs: result.rows})
})







module.exports = router