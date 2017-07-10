const FilterDAO = require("./filterDAO");

const { ipcMain } = require('electron');

const filtersDAO = new FilterDAO('filters');

ipcMain.on('addFilter', (event, f) => {
  filtersDAO.addFilter(f);
  event.returnValue = f
})

ipcMain.on('removeFilter', function (f) {
  filtersDAO.removeFilter(f);
  event.returnValue = f
});

ipcMain.on('getAllFilters', (event, arg) => {
  filtersDAO.getAllFilters().then(function (getAll) {
    event.sender.send('getAllFilters', getAll);
  })
});
