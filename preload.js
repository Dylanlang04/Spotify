const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getPlaylists: () => ipcRenderer.invoke('get-playlists'),
  addPlaylist: (data) => ipcRenderer.invoke('add-playlist', data),
  saveToken: (token) => ipcRenderer.send('save-token', token),
  getToken: (token) => ipcRenderer.invoke('get-token', token),
  deleteToken: () => ipcRenderer.send('delete-token'),
  syncDb: () => ipcRenderer.send('sync-db')
})