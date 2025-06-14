require('dotenv').config();
const express = require('express')
const cors = require('cors')
const { Client } = require('pg')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const app = express()
app.use(cors())
app.use(express.json())


const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.end.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
})

async function generateSignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: 'spotifymusic',
    Key: key,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 500 });

  return signedUrl;
}
app.get('/api/song/:songKey', async (req, res) => {
  const songKey = req.params.songKey
  try {
    const signedUrl = await generateSignedUrl(songKey)
    res.json({ url: signedUrl })
  } catch (error) {
    console.error('Failed to generate signed URL:', error)
    res.status(500).json({ error: 'Failed to generate signed URL' })
  }
})

app.get('/users', async (req, res) => {
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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})