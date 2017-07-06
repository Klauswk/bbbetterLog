const electron = require("electron");
const { app } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");

app.on("ready", () => {

  const mainWindow = new BrowserWindow();

  console.log(path.join(__dirname + '/public/index.html'));

  mainWindow.loadURL('file://' +  __dirname  + '/public/index.html');
  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
