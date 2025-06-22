const express = require('express')
const router = express.Router()
const { authenticateToken, generateSignedUrl } = require('../utils/utils')

router.get('/api/admin/users', async (req, res) => {
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




module.exports = router