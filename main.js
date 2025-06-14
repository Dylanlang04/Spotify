const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = path.join(app.getPath('userData'), 'playlists.db')
const db = new sqlite3.Database(dbPath)
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
	win.loadFile('index.html')
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
