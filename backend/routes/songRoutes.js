const express = require('express')
const router = express.Router()
const { authenticateToken, generateSignedUrl } = require('../utils/utils')


router.get('/:songId', async (req, res) => {
  try {
    const songId = req.params.songId
    const url = await generateSignedUrl(songId)
    res.json({ url })
  } catch (err) {
    console.error(err)

    res.status(500).json({ error: 'Failed to generate signed URL' })
  }
})

module.exports = router