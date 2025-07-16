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
import { json } from 'stream/consumers';


const app = express();

const PORT = process.env.PORT || 3001;

const activeGames = {};

const pendingUploads = new Map()
const ytPos = new Map()
const ytResults = new Map()

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
    if(name === 'get') {
      const title = req.body.data.options[0].value
      const artist = req.body.data.options[1].value

      await res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      })
      const r2url = `${process.env.R2URL}/${title} - ${artist}.mp3`
      try {
        const result = await fetch(r2url)

        if(!result.ok) {
          throw new Error("Failed to get song")
        }
        const arrayBuffer = await result.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const blob = new Blob([buffer], { type: 'audio/mpeg' })
        const form = new FormData()
        form.append('content', `✅ Found ${title} - ${artist}`)
        form.append('files[0]', blob, `${title} - ${artist}.mp3`)


        await fetch(`https://discord.com/api/v10/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, {
          method: 'PATCH',
          headers: form.headers,
          body: form
        })
      } catch (e) {
        console.error("failed to send MP3: ", e)

        await ut.DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: '❌ Could send the MP3 file. (SEE CONSOLE)'
          })
        })
      }
      
      
      
      
      
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
          const jsonObject = await ut.createTrackJson(opt2, opt3)
    
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
      
      
      
      await res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      })

      for (const item of data.items) {
        const track = item.track
        const title = track.name.replaceAll('|', '')
        const artist = track.artists[0].name.replaceAll('|', '')
        const yt = await ut.searchYouTube(`${title} - ${artist} lyric video`)
        const result = yt[0].url
        ytPos.set(`${track.id}`, 0)
        ytResults.set(`${track.id}`, yt)

        await ut.DiscordRequest(`/channels/1389968930650456164/messages`, {
           method: 'POST',
            body: {
              content: `🎵 ${title} — ${artist} link: ${result}`,
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
                    },
                    {
                      type: 2,
                      label: 'Next',
                      style: 1,
                      custom_id: `next|${track.id}|${title}|${artist}`,
                    }
                  ]
                }
              ]
            }
        })
        await ut.delay(1000)
      }
      await ut.DiscordRequest(`/webhooks/${process.env.APP_ID}/${req.body.token}/messages/@original`, {
        method: 'PATCH',
        body: {
          content: '✅ Playlist processed and messages sent!',
          components: []
        }
      })

    }

  }
  if(type === InteractionType.MESSAGE_COMPONENT) {
    const {custom_id} = data
    const userId = req.body.member.user.id
    const [action, ...args] = custom_id.split("|")
    if(action ==='add') {
      const[trackId, title, artist] = args
      const yt = ytResults.get(trackId)
      const pos = ytPos.get(trackId)
      const jsonObject =await ut.createTrackJson(title, artist)
      if(ut.mp3toBackend(yt[pos].url, title, artist, jsonObject)) {
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `✅ Final upload complete!`,
            components: []
          },
      })
      }
    } 
    if (action === 'skip') {
      const[trackId, title, artist] = args
      ytPos.delete(trackId)
      ytResults.delete(trackId)
      return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `❌you have skipped adding this song.`,
            components: []
          },
      })
    }
    if (action ==='next') {
      const [trackId, title, artist] = args
      const pos = ytPos.get(trackId)
      const yt = ytResults.get(trackId)
      if (pos + 1 <= 4) {
        ytPos.set(`${trackId}`, pos + 1)
      } else {
        ytPos.delete(trackId)
        ytResults.delete(trackId)
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `❌ We ran out of results to show you \ntry uploading the mp3 manually via **/Upload**`,
            components: []
          },
        })
      }
      
      return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: `🎵 ${title} - ${artist} link: ${yt[pos+1].url}`,
            components: [
              {
                  type: 1,
                  components: [
                    {
                      type: 2,
                      label: 'Add',
                      style: 3,
                      custom_id: `add|${trackId}|${title}|${artist}`,
                    },
                    {
                      type: 2,
                      label: 'Skip',
                      style: 4,
                      custom_id: `skip|${trackId}|${title}|${artist}`,
                    },
                    {
                      type: 2,
                      label: 'Next',
                      style: 1,
                      custom_id: `next|${trackId}|${title}|${artist}`,
                    }
                  ]
                }
            ]
          },
      })
    }

    if(action === 'confirm_upload') {
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
    if(action === 'cancel_upload') {
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
