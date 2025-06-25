const express = require('express')
const router = express.Router()
const { Client } = require('pg')
const { authenticateToken, generateSignedUrl } = require('../utils/utils')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const jwt = require('jsonwebtoken')

const jwt_secret = process.env.JWTSECRET

router.get('/:token', async (req, res)=> {
  const token = req.params.token
  
  jwt.verify(token, jwt_secret, (err, decoded) => {
    
    if (err) {
      return res.status(404).json({message: "error"})
    } else {
      return res.json({userId: decoded.userId})
    }
  })
})

router.get('/data/:token', async (req, res) => {
  
  const token = req.params.token
  jwt.verify(token, jwt_secret, async (err, decoded) => {
    if (err) {
      res.status(401).json({message: "error"})
    } else {
      const client = new Client ({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
      })
      
      client.connect()
      const playlists = await client.query(`SELECT * FROM playlists WHERE userid = $1`, [decoded.userId])
      client.end()
      
      
      res.status(200).json({playlists: playlists, userId: decoded.userId})
    }
  })
  
})


module.exports = router