const express = require('express')
const router = express.Router()
const { Client } = require('pg')
const { authenticateToken, generateSignedUrl } = require('../utils/utils')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

router.delete('/delete/:playlistId/:userId', async (req, res) => { 
  const { playlistId, userId } = req.params
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  })
  console.log( playlistId)
  console.log(userId)
  console.log("test")
  client.connect()
  await client.query(`DELETE FROM playlists WHERE userid = $1 AND playlist_id = $2`, [userId, playlistId])
  client.end()
  res.status(200).json({message: "Success"})
})


router.post('/create/:token', async (req, res) => {
  jwt.verify(req.params.token, jwt_secret, async (err, payload) => {
    if (err) {
      return res.status(404).json({message: "ERROR"})
    } else {
      const client = new Client({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
      })
      await client.connect()
      const result = await client.query(`SELECT name, playlist_count FROM users WHERE id = $1`, [payload.userId])
      const result2 = await client.query(`INSERT INTO playlists (userid, name, playlist_name) VALUES ($1, $2, $3)`, 
        [payload.userId, result.rows[0].name, "My Playlist #" + result.rows[0].playlist_count])


      await client.end()
      return res.status(200).json({success: true})
    }
  })
})


router.get('/:token', authenticateToken, (req, res) => {
  console.log(req.user)
})




module.exports = router