const jwt = require('jsonwebtoken')
const { GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const jwt_secret = process.env.JWTSECRET

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

async function generateSignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: 'spotifymusic',
    Key: key,
    
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 500 });

  return signedUrl;
}

module.exports = {
  authenticateToken,
  generateSignedUrl
}