require('dotenv').config();
const express = require('express')
const cors = require('cors')
const { Client } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

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

const PORT = process.env.PGPORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})