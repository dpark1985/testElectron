const { app, BrowserWindow, Menu, ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let addWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({ width: 800, height: 600 })

	// and load the index.html of the app.
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
		if (addWindow) {
			addWindow.close();
		}

	})

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add New Todo'
	});
	addWindow.loadFile('add.html');

	addWindow.on('closed', () => {
		addWindow = null;
	});
}

ipcMain.on('todo:add', (event, arg) => {
	mainWindow.webContents.send('todo:add', arg);

	addWindow.close();
});


const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo',
				click: () => {
					createAddWindow();
				}
			},
			{
				label: 'Clear Todos',
				click: () => {
					mainWindow.webContents.send('todo:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Control+Q',
				click: () => {
					app.quit();
				}
			}
		]
	}
]

if (process.platform === 'darwin') {
	menuTemplate.unshift({

	});
}

if (process.env.NODE_ENV !== 'production') {
	menuTemplate.push({
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'toggleDevTools' }
		]

	})
}