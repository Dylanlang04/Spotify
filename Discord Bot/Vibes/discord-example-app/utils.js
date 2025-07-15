import 'dotenv/config';

import ffmpeg from 'fluent-ffmpeg'
import FormData from 'form-data'
import { spawn } from 'child_process'
import fetch from 'node-fetch'
import { json } from 'stream/consumers';



ffmpeg.setFfmpegPath('C:/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe')

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}
export async function InstallGuildCommands(appId, guildId, commands) {
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  try {
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function searchYouTube(query) {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/search'
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    key: process.env.GOOGLEAPI,
    maxResults: 5,
    type: 'video'
  })

  const res = await fetch(`${baseUrl}?${params.toString()}`)
  const data = await res.json()

  if (!data.items) throw new Error('No results found')

  return data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
  }))
}

export async function createTrackJson(title, artist) {
  const response = await fetch(`http://localhost:3000/api/discord/cover/${title}/${artist}`)
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

  let artists = []
  for (let i = 0; i < track.artists.length - 1; i++) {
    let artist = {}
    artist['id'] = track.artists[1 + i].id
    artist['name'] = track.artists[1+i].name
    artist['type'] = track.artists[1+i].type 
    artists[i]   
  }
  jsonObject['featured_artists'] = artists
  
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

  return jsonObject
}

export async function mp3toBackend(url, title, artist, jsonObject) {
  return new Promise((resolve, reject) => {
    const yt = spawn('yt-dlp', [
      '-f', 'bestaudio',
      '--extract-audio',
      '--audio-format', 'mp3',
      '--output', '-',
      url
    ])

    yt.stderr.on('data', (data) => {
      console.error('yt-dlp stderr:', data.toString())
    })

    yt.on('error', reject)

    const form = new FormData()
    form.append('file', yt.stdout, {
      filename: `${title} - ${artist}.mp3`,
      contentType: 'audio/mpeg'
    })
    form.append('metadata', JSON.stringify(jsonObject))

    fetch('http://localhost:3000/api/discord/upload-song', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    })
      .then(async res => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        const json = await res.json()
        console.log('✅ Upload complete:', json)
        resolve(json)
      })
      .catch(err => {
        reject(err)
        yt.kill() 
      })

    yt.on('close', (code) => {
      if (code !== 0) {
        console.error(`yt-dlp exited with code ${code}`)
      }
    })
  })
}
