const express = require('express')
const router = express.Router()
const utils = require('../utils/utils')
const { Client } = require('pg')
const jwt = require('jsonwebtoken')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const upload = multer()
const mm = require('music-metadata')
const fs = require('fs')

const jwt_secret = process.env.JWTSECRET

const s3Client = new S3Client({
  region: 'auto', 
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.GODACCESS,
    secretAccessKey: process.env.GODSECRET,
  },
})

router.get('/cover/:title/:artist', async (req, res) => {
    const token = await utils.getSpotifyAccessToken()
    const {title, artist} = req.params
    const track = await utils.searchExactSpotifyTrack(title, artist, token)
    
    return res.json({track})
})

router.post("/upload-song", upload.single('file'), async (req, res) => {
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  })
  const json = JSON.parse(req.body.metadata)
  console.log(json)
  try {
    client.connect()
    const add_artist = await client.query(`INSERT INTO artists (artist_id, name) VALUES
      ($1, $2)
      ON CONFLICT (artist_id) DO NOTHING;`, [json.main_artist.artist_id, json.main_artist.name]
    )


    const query = `
      INSERT INTO tracks (
        track_title, duration_ms, release_date, genre, explicit, producer, writer,
        performer, popularity, lyrics_url, spotify_track_id, total_plays, skip_rate,
        like_count, bpm, key, isrc_code, artist_id, main_artist, featured_artists,
        track_type, track_number, disc_number, image_urls, album_id
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21,
        $22, $23, $24, $25
      )
    `
    const values = [
      json.title,
      json.duration_ms,
      json.release_date,
      json.genre,
      json.explicit,
      json.producer,
      json.writer,
      json.producer,
      json.popularity,
      json.lyrics_url,
      json.track_id,
      json.total_plays ?? 0,
      json.skip_rate,
      json.like_count ?? 0,
      json.bpm,
      json.key,
      json.isrc,
      json.main_artist.artist_id,
      json.main_artist,
      json.feautured_artists || [],
      json.type,
      json.track_number,
      json.disc_num,
      json.images,
      json.album.album_id
    ]
    const result = await client.query(query, values)
    client.end()
  } catch (e) {
    console.log(e)
  }
  
  
    const file = req.file
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

router.post("/add-song", upload.single('file'), (req, res) => {
    console.log('File:', req.file)
    console.log('Body:', req.body)
    try {
      const json = JSON.parse(req.body.metadata)
      console.log('Metadata JSON:', json)
    } catch(e) {
      console.error('Error parsing metadata:', e)
    }
    res.json({ success: true })
})



module.exports = router