import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'
import fs from 'fs';
import Store from 'electron-store'
const sqlite = sqlite3.verbose()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const store = new Store();

let db = null



//DATABASE MANAGEMENT
async function loadDatabase(userId) {
  const dbPath = path.join(app.getPath('userData'), `user_${userId}.db`)
  db = new sqlite.Database(dbPath, (err) => {
    if (err) {
      console.error(`Error opening DB for user ${userId}:`, err)
    } else {
      console.log(`Loaded DB for user ${userId}:`, dbPath)
    }
  })


}
async function syncDatabase() { // syncs with server. abstraction
  const token = store.get('authToken')
  const response = await fetch(`http://localhost:3000/api/user/data/${token}`)
  const result = await response.json()
  
  for (var i =0; i < result.playlists.rows.length; i++ ) {
    addPlaylist(result.playlists.rows[i])
  }
  

}

async function loadUserData() {
  const userId = store.get('userId')
  const dbPath = path.join(app.getPath('userData'), `user_${userId}.db`)
  db = new sqlite.Database(dbPath, (err) => {
    if (err) {
      console.error(`Error opening DB for user ${userId}:`, err)
    } else {
      console.log(`Loaded DB for user ${userId}:`, dbPath)
    }
  })
  syncDatabase()
}

async function addPlaylist(playlist) {
  db.run(`
    INSERT INTO playlists (
      playlist_id,
      name,
      description,
      created_at,
      updated_at,
      cover_img_url,
      is_public,
      track_count,
      duration_ms,
      genre_tag,
      favourite,
      time_played,
      last_played_at,
      playlist_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(playlist_id) DO UPDATE SET
      name = excluded.name,
      description = excluded.description,
      updated_at = excluded.updated_at,
      cover_img_url = excluded.cover_img_url,
      is_public = excluded.is_public,
      track_count = excluded.track_count,
      duration_ms = excluded.duration_ms,
      genre_tag = excluded.genre_tag,
      favourite = excluded.favourite,
      time_played = excluded.time_played,
      last_played_at = excluded.last_played_at,
      playlist_name = excluded.playlist_name;
  `, [playlist.playlist_id, playlist.name, playlist.description, playlist.created_at, playlist.updated_at, playlist.cover_image_rul, playlist.is_public, playlist.track_count, playlist.duration_ms, playlist.genre_tag, playlist.favourite, playlist.times_played, playlist.last_played_at, playlist.playlist_name])
}
async function deletePlaylist(playlistId) {
   db.run("DELETE FROM playlists WHERE playlist_id = ?", [playlistId]) 
}

ipcMain.on('save-token', async (event, token) => {
  store.set('authToken', token)
  const response = await fetch(`http://localhost:3000/api/user/data/${token}`)
  const result = await response.json()
  store.set("userId", result.userId)
})

ipcMain.on('delete-token', async () => {
  store.delete('authToken')
})

ipcMain.handle('get-token', async () =>{
  return store.get('authToken')
}) 

ipcMain.on('create-db', async () => {
  const token = store.get('authToken')
  const response = await fetch(`http://localhost:3000/api/user/${token}`)
  const resJson = await response.json()
  const userId = resJson.userId
  
   
  const dbPath = path.join(app.getPath('userData'), `user_${userId}.db`)
  const dbExists = fs.existsSync(dbPath);
  if (!dbExists) {
    db = new sqlite.Database(dbPath)
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS playlists (
          playlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          cover_img_url TEXT,
          is_public BOOLEAN DEFAULT FALSE,
          track_count INTEGER DEFAULT 0,
          duration_ms BIGINT DEFAULT 0,
          genre_tag TEXT,
          favourite BOOLEAN DEFAULT FALSE,
          time_played INTEGER DEFAULT 0,
          last_played_at TEXT,
          playlist_name TEXT
        )
     `)

      db.run(`
        CREATE TABLE IF NOT EXISTS playlist_tracks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          playlist_id INTEGER,
          track_id TEXT,
          track_name TEXT,
          artist_name TEXT,
          duration_ms INTEGER,
          FOREIGN KEY (playlist_id) REFERENCES playlists(id)
        )
      `)
      db.run(`
        CREATE TRIGGER IF NOT EXISTS delete_playlist_tracks
          AFTER DELETE ON playlists
          FOR EACH ROW
          BEGIN
          DELETE FROM playlist_tracks WHERE playlist_id = OLD.playlist_id;
          END;
      `)
    })
    return true
  } else {
    await loadDatabase(userId)
    return false
  }
})

//Do i really need this? if im creating a db if it doesnt exist and loading the db if it already does?
//i just retrieve the data from server if its an existing user on a new device
ipcMain.on('login-db', async ()=> {
  const token = store.get('authToken')
  
  const response = await fetch(`http://localhost:3000/api/user/${token}`)
  const result = await response.json()
  store.set("userId", result.userId)
  return result

})
ipcMain.on('logout-db', async ()=> {
  db.close((err) => {
    if (err) {
      console.log("error closing db")
    } 
  })
})
ipcMain.on('addSong-db', async (song)=> {

})
ipcMain.on('deleteSong-db', async (songId)=> {

})
ipcMain.on('add-playlist', async (playlist)=> {
  addPlaylist(playlist)
})
ipcMain.on('deletePlaylist-db', async (_, playlistId) => {
  
  deletePlaylist(playlistId)
  const userId = store.get("userId")
  const response = await fetch(`http://localhost:3000/api/playlist/delete/${playlistId}/${userId}`, {
    method: 'DELETE'
  })
  const result = await response.json()
  console.log(result.status)

})
ipcMain.on('sync-db', async () => {
  
  //DESIGN
  //ON LOGIN FETCH DB FROM SERVER | dif func
  //ON LOGOUT DROP DB | dif func
  //ON LAUNCH ADD UNSYNCED DATA FROM SERVER, IGNORE NON NEW ENTRIES. | this func
  //WHEN USER ADDS SONG ADD TO CLIENT SIDE DB AND TO SERVER | dif func
  //DELETE SONG
  //DELETE PLAYLIST
  syncDatabase()
})


ipcMain.handle('get-playlists', async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM playlists`, [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
})












/// CREATE WINDOW


const createWindow = async () => {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 810,
		minHeight: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false
		}
	})
  const token = store.get('authToken')
  const res = await fetch('http://localhost:3000/api/account/protected', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    //serve an initial html page that is a loading screen. TO DO
	if (res.status === 200) {
    
    win.loadURL('http://localhost:3000/api/load/spotify')
  } else {
    loadUserData()
    win.loadURL('http://localhost:3000/api/load/login_page')
  }
}


app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
	if(BrowserWindow.getAllWindows().length == 0) createWindow()
	})
})

app.on('window-all-closed', () => {
if(process.platform !== 'darwin') app.quit()
}) 
