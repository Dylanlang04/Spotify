const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getPlaylists: () => ipcRenderer.invoke('get-playlists'),
  addPlaylist: (playlist) => ipcRenderer.send('add-playlist', playlist),
  saveToken: (token) => ipcRenderer.send('save-token', token),
  getToken: (token) => ipcRenderer.invoke('get-token', token),
  deleteToken: () => ipcRenderer.send('delete-token'),
  getUserId: () => ipcRenderer.send('get-userid'),
  loginDb: () => ipcRenderer.send('login-db'),
  logoutDb: () => ipcRenderer.send('logout-db'),
  addSong: (song) => ipcRenderer.send('addSong-db', song),
  deleteSong: (songId) => ipcRenderer.send('deleteSong-db', songId),
  deletePlaylist: (playlistId) => ipcRenderer.send('deletePlaylist-db', playlistId),
  createDb: () => ipcRenderer.send('create-db'),
  syncDb: () => ipcRenderer.send('sync-db')
})