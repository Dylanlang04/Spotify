const {app, BrowserWindow} = require('electron')
const path = require('node:path')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 810,
		minHeight: 600
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
