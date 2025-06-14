const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getPlaylists: () => ipcRenderer.invoke('get-playlists'),
  addPlaylist: (data) => ipcRenderer.invoke('add-playlist', data)
})