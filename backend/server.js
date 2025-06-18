require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Client } = require('pg')
const path = require('path')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const jwt = require('jsonwebtoken')

const jwt_secret = process.env.JWTSECRET

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../')))



const s3Client = new S3Client({
  region: 'auto',

  endpoint: process.env.ENDPOINT,
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

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` })
})

app.get('/login_page', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'login.html'))
})


app.get('/spotify', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'))
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  })
  await client.connect()
  const result = await client.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  await client.end()
  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  const user = result.rows[0]
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' })
  }
  if (user.password_hash !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password' })
  }
  const jwt_token = jwt.sign({userId: user.id, email: user.email}, jwt_secret, {
    expiresIn: '1m'
  })
  return res.json({ success: true, token: jwt_token })
})

app.get('/api/song/:songId', async (req, res) => {
  try {
    const songId = req.params.songId
    const url = await generateSignedUrl(songId)
    res.json({ url })
  } catch (err) {
    console.error(err)

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