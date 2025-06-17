import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'
import Store from 'electron-store'
const sqlite = sqlite3.verbose()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const store = new Store();

const dbPath = path.join(app.getPath('userData'), 'playlists.db')
const db = new sqlite.Database(dbPath)
app.setName("Dylans_Spotify_App")
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
})
console.log('Database path:', dbPath);

ipcMain.handle('get-playlists', async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM playlists`, [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
})

ipcMain.handle('add-playlist', async (event, { name, description }) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO playlists (name, description) VALUES (?, ?)`,
      [name, description],
      function (err) {
        if (err) reject(err)
        else resolve({ id: this.lastID })
      })
  })
})


const createWindow = () => {
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
  console.log(token)
	if (token) {
    win.loadURL('http://localhost:3000/spotify.html')
  } else {
    win.loadURL('http://localhost:3000/login_page')
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
