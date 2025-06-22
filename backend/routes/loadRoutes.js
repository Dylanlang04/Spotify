const express = require('express')
const router = express.Router()
const { authenticateToken, generateSignedUrl } = require('../utils/utils')



router.get('/login_page', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'login.html'))
})


router.get('/spotify', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'))
})

module.exports = router