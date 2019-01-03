'use strict';

const { app, BrowserWindow } = require('electron');
const smartcard = require('smartcard');
const Devices = smartcard.Devices;
const Iso7816Application = smartcard.Iso7816Application;

const devices = new Devices();

devices.on('device-activated', event => {
	const currentDevices = event.devices;
	let device = event.device;
	console.log(`Device '${device}' activated, devices: ${currentDevices}`);
	for (let prop in currentDevices) {
		console.log("Devices: " + currentDevices[prop]);
	}

	device.on('card-inserted', event => {
		let card = event.card;
		console.log(`Card '${card.getAtr()}' inserted into '${event.device}'`);

		card.on('command-issued', event => {
			console.log(`Command '${event.command}' issued to '${event.card}' `);
		});

		card.on('response-received', event => {
			console.log(`Response '${event.response}' received from '${event.card}' in response to '${event.command}'`);
		});

		const application = new Iso7816Application(card);
		application.selectFile([0x31, 0x50, 0x41, 0x59, 0x2E, 0x53, 0x59, 0x53, 0x2E, 0x44, 0x44, 0x46, 0x30, 0x31])
            .then(response => {
            	console.info(`Select PSE Response: '${response}' '${response.meaning()}'`);
            }).catch(error => {
            	console.error('Error:', error, error.stack);
            });

	});
	device.on('card-removed', event => {
		console.log(`Card removed from '${event.name}' `);
	});

});

devices.on('device-deactivated', event => {
	console.log(`Device '${event.device}' deactivated, devices: [${event.devices}]`);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
