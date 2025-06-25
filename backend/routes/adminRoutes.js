const express = require('express')
const router = express.Router()
const { authenticateToken, generateSignedUrl } = require('../utils/utils')
const { Client } = require('pg')
const jwt = require('jsonwebtoken')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const upload = multer()

const jwt_secret = process.env.JWTSECRET

const s3Client = new S3Client({
  region: 'auto', 
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.GODACCESS,
    secretAccessKey: process.env.GODSECRET,
  },
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
      console.log(result)
      res.json({user: result.rows[0]})
    }
  } )


})
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file

  if (!file) return res.status(400).send('No file uploaded.')

  const command = new PutObjectCommand({
    Bucket: 'spotifymusic',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command)
    res.json({ message: 'File uploaded successfully!' })
  } catch (err) {
    console.error('Upload failed:', err)
    res.status(500).json({message: "upload failed"})
  }
})






module.exports = router