const express = require('express')
const router = express.Router()
const utils = require('../utils/utils')
const { Client } = require('pg')
const jwt = require('jsonwebtoken')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const multer = require('multer')
const upload = multer()
const mm = require('music-metadata')
const fs = require('fs')

const jwt_secret = process.env.JWTSECRET

const s3Client = new S3Client({
  region: 'auto', 
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.GODACCESS,
    secretAccessKey: process.env.GODSECRET,
  },
})

router.get('/cover/:title/:artist', async (req, res) => {
    const token = await utils.getSpotifyAccessToken()
    const {title, artist} = req.params
    const track = await utils.searchExactSpotifyTrack(title, artist, token)
    
    return res.json({track})
})

router.post("/upload-song", upload.single('file'), (req, res) => {
    console.log(req.file)
    const json = JSON.parse(req.body.metadata)
    console.log(json.album.images[0])
    console.log(json.album.artists[0])
    console.log(JSON.parse(req.body.metadata))
    
    res.send({success: true})
})



module.exports = router