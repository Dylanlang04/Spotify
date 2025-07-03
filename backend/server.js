require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Client } = require('pg')
const path = require('path')

const jwt = require('jsonwebtoken')

const jwt_secret = process.env.JWTSECRET
const playlistRoutes = require('./routes/playlistRoutes')
const loadRoutes = require('./routes/loadRoutes')
const userRoutes = require('./routes/userRoutes')
const accountRoutes = require('./routes/accountRoutes')
const songRoutes = require('./routes/songRoutes')
const adminRoutes = require('./routes/adminRoutes')
const discordRoutes = require('./routes/discordRoutes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../')))
app.use('/api/load/styles', express.static(path.join(__dirname, '../styles')))
app.use('/api/playlist', playlistRoutes)
app.use('/api/load', loadRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/user', userRoutes)
app.use('/api/song', songRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/discord', discordRoutes)








const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})