import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import * as ut from './utils.js';
import * as utils from '../../../backend/utils/utils.js'


const app = express();

const PORT = process.env.PORT || 3001;

const activeGames = {};

const pendingUploads = new Map()

async function handleUpload(fileUrl, jsonObject, filename) {
  const fileRes = await fetch(fileUrl)
  const fileBlob = await fileRes.blob()

  const formData = new FormData()
  formData.append('file', fileBlob, filename)
  formData.append('metadata', JSON.stringify(jsonObject))

  return await fetch('http://localhost:3000/api/discord/upload-song', {
    method: 'POST',
    body: formData,
  })
}


app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
 
  const { id, type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }


  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    console.log(name)

    // "test" command
    if (name === 'test') {
      
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              
              content: `hello world ${getRandomEmoji()}`
            }
          ]
        },
      });
    }
    if(name === 'gett') {
      const response = await ut.DiscordRequest('channels/1389968930650456164/messages', { method: 'GET' })
      const messages = await response.json()
      console.log(messages)
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `GET MESSAGE 0 -> ${messages[1].content}`
            }
          ]
        },
      });
    }
    if(name === 'upload') {
      const opt1 = req.body.data.options[0]
      const opt2 = req.body.data.options[1].value
      const opt3 = req.body.data.options[2].value
      await res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      })

      return setTimeout(async () => {
        try {
          

          const file = req.body.data.resolved.attachments[opt1.value]
          const fileUrl = file.url

      
          const response = await fetch(`http://localhost:3000/api/discord/cover/${opt2}/${opt3}`)
          const trackJson = await response.json()
          const track = trackJson.track.track
          const jsonObject = {}
          let main_artist = {}
          let album = {}

          album['album_type'] = track.album.album_type
          album['album_id'] = track.album.id
          album['images'] = track.album.images
          album['name'] = track.album.name
          album['release_date'] = track.album.release_date
          album['total_tracks'] = track.album.total_tracks
          album['type'] = track.album.type
          let album_artists = []
          for (let i = 0; i < track.album.artists.length; i++) {
              let artist = {}
              artist['id'] = track.album.artists[i].id
              artist['name'] = track.album.artists[i].name
              artist['type'] = track.album.artists[i].type
              album_artists[i] = artist
          }
          album['artists'] = album_artists
          jsonObject['album'] = album

          main_artist['name'] = track.artists[0].name
          main_artist['artist_id'] = track.artists[0].id
          main_artist['type'] = track.artists[0].type
          jsonObject['main_artist'] = main_artist

          if (track.artists.length > 1) {
              let artists = []
              for (let i = 0; i < track.artists.length - 1; i++) {
                  let artist = {}
                  artist['id'] = track.artists[1 + i].id
                  artist['name'] = track.artists[1+i].name
                  artist['type'] = track.artists[1+i].type 
                  artists[i]   
              }
              jsonObject['featured_artists'] = artists
          }
          jsonObject['title'] = track.name
          jsonObject['track_id'] = track.id
          jsonObject['popularity'] = track.popularity
          jsonObject['isrc'] = track.external_ids.isrc
          jsonObject['explicit'] = track.explicit
          jsonObject['duration_ms'] = track.duration_ms
          jsonObject['disc_num'] = track.disc_number
          jsonObject['release_date'] = track.album.release_date
          jsonObject['images'] = track.album.images
          jsonObject['track_number'] = track.track_number
          jsonObject['type'] = track.type
        
          let fields =['genre', 'producer', 'writer', 'performer', 'lyrics_url', 'key']
          fields.forEach(field => {
              jsonObject[field] = null 
          })

          let numFields = ['total_plays', 'skip_rate', 'like_count', 'bpm']
          numFields.forEach(field => {   
              jsonObject[field] = null
          })
          


          const userId = req.body.member.user.id
          console.log(userId)
          pendingUploads.set(userId, {
            fileUrl,
            jsonObject,
            filename: file.filename
          })




          await ut.DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}`, {
            method: 'POST',
            body: {
              content: `✅ Upload complete!\n**Title:** ${jsonObject.title}\n**Artist:** ${jsonObject.main_artist.name} \n\n **Is this the correct song?**`,
              components: [
                {
                  type: 1,
                  components: [
                    {
                      type: 2,
                      label: 'Yes',
                      style: 3,
                      custom_id: 'confirm_upload',
                    },
                    {
                      type: 2,
                      label: 'No',
                      style: 4,
                      custom_id: 'cancel_upload',
                    }
                  ]
                }
                
              ]
            },
          });
        } catch(e) {
          console.error("❌ Error during upload:", e);

          await ut.DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}`, {
            method: 'POST',
            body: {
              content: `❌ Upload failed. Please try again later.`,
            },
          });
        }
      })

    }
    if (name === 'upload_playlist') {
      const url = req.body.data.options[0].value
      const id = utils.extractSpotifyId(url)
      
      const spotifyAccessToken = await utils.getSpotifyAccessToken()
      const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&offset=0`, {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`
        }
      })
      const data = await response.json()
      console.log(data)
      
      
      
      await res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      })

      for (const item of data.items) {
        const track = item.track
        const title = track.name.replaceAll('|', '')
        const artist = track.artists[0].name.replaceAll('|', '')
        await ut.DiscordRequest(`/channels/1389968930650456164/messages`, {
           method: 'POST',
            body: {
              content: `🎵 ${title} — ${artist}`,
              components: [
                {
                  type: 1,
                  components: [
                    {
                      type: 2,
                      label: 'Add',
                      style: 3,
                      custom_id: `add|${track.id}|${title}|${artist}`,
                    },
                    {
                      type: 2,
                      label: 'Skip',
                      style: 4,
                      custom_id: `skip|${track.id}|${title}|${artist}`,
                    }
                  ]
                }
              ]
            }
        })
        await ut.delay(1000)
      }

    }

  }
  if(type === InteractionType.MESSAGE_COMPONENT) {
    const {custom_id} = data
    const userId = req.body.member.user.id

    if(custom_id === 'confirm_upload') {
      const uploadData = pendingUploads.get(userId)
      if(!uploadData) {
          return await ut.DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}`, {
            method: 'POST',
            body: {
              content: `❌ Upload data expired or not found.`,
            },
          })
      }
      const { fileUrl, jsonObject, filename } = uploadData
      try {
        const fileRes = await fetch(fileUrl)
        const fileBlob = await fileRes.blob()
        const formData = new FormData()
        formData.append('file', fileBlob, filename)
        formData.append('metadata', JSON.stringify(jsonObject))

        const uploadRes = await fetch('http://localhost:3000/api/discord/upload-song', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) throw new Error('Upload failed')
        pendingUploads.delete(userId)
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `✅ Final upload complete!`,
            components: []
          },
        })
        
      } catch(e) {
        console.error("❌ Upload error:", e)

        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `❌ Upload data expired or not found.`,
            components: []
          },
        })
      }
      

    }
    if(custom_id === 'cancel_upload') {
      pendingUploads.delete(userId)
      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: '❌ Upload Cancelled',
          components: []
        }
      })
    }
  }
})

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
