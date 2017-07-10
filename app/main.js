const electron = require('electron');
const { app } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

app.on('ready', () => {

  const mainWindow = new BrowserWindow();

  const filtersDAO = FiltersDAO('filters');
  filtersDAO.removeFilter({ name: "blalb", message: "dasda" });
  filtersDAO.getAllFilters().then(function(result){
    console.log(result);
  });

  //mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  //mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

function FiltersDAO(tableName) {
  filter = {}
  filter.db = new sqlite3.Database(tableName);
  filter.tableName = tableName;

  filter.db.serialize(() => {
    filter.db.run(`CREATE TABLE IF NOT EXISTS ${filter.tableName} (name TEXT, message TEXT)`);
  });

  filter.getAllFilters = function () {
    const filters = [];
    const promise = new Promise((resolve, reject)=>{
      filter.db.serialize(() => {
        filter.db.all(`SELECT * FROM ${filter.tableName} `, function (err, rows) {
          if (err) {
            console.error('Error', err);
            reject(err);
          }
          resolve(rows.map(f=>({name:f.name,message:f.message})));
        });
      });
    });

    return promise;
  }

  filter.addFilter = function (f) {
    filter.db.serialize(() => {
      filter.db.run(`INSERT INTO ${filter.tableName} (name,message) VALUES(?,?)`, f.name, f.message);
    });

  }

  filter.removeFilter = function (f) {
    filter.db.serialize(() => {
      filter.db.run(`DELETE FROM ${filter.tableName} where name = ?`, f.name);
    });
  }

  return filter;
}
