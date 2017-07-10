const electron = require('electron');
const { app } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const filterEvents = require("./filterEvents");

app.on('ready', () => {

  const mainWindow = new BrowserWindow();
  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});




