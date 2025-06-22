const express = require('express')
const router = express.Router()
const { authenticateToken, generateSignedUrl } = require('../utils/utils')

router.post('/register', async (req, res) => {
  const {username, email, phone, password} = req.body
  const client = new Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  })
  await client.connect()
  
  const result1 = await client.query('SELECT * FROM users WHERE email = $1', [email])
  const result2 = await client.query('SELECT * FROM users WHERE name = $1', [username])
  if (result1.rows.length === 0 && result2.rows.length === 0) {
    await client.query(`INSERT INTO users (name, email, password_hash, phone_number)
      VALUES ($1, $2, $3, $4)`, [username, email, password, phone])
    const result = await client.query("SELECT id FROM users WHERE email = $1", [email])
    console.log(result)
    await client.query('INSERT INTO playlists (userid, name, playlist_name) VALUES ($1, $2, $3)', [result.rows[0].id, username, "Liked Songs"])
    
      await client.end()
       
    return res.status(200).json({success: true})
  } else if(result1.rows.length !== 0) {
    await client.end()
    
    return res.status(409).json({success:false, invalid: "email",  message:'User already exists with the provided email.'})
  } else {
    
    await client.end()
    return res.status(409).json({success:false, invalid: "user", message: 'User already exists with that username.'})
  }
  
})

router.post('/login', async (req, res) => {
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
    expiresIn: '10m'
  })
  return res.json({ success: true, token: jwt_token })
})

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` })
})

module.exports = router