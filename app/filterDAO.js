
const sqlite3 = require('sqlite3').verbose();

class FilterDAO {

  constructor(tableName) {
    this.tableName = tableName;

    this.db = new sqlite3.Database(tableName);

    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (name TEXT, message TEXT)`);
    });
  }

  getAllFilters() {
    let filters = [];
    const promise = new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all(`SELECT * FROM ${this.tableName} `, function (err, rows) {
          if (err) {
            console.error('Error', err);
            reject(err);
          }
          filters = rows.map(f => ({ name: f.name, message: f.message }));
          console.log("Returning: ", filters);
          resolve(filters);
        });
      });
    });

    return promise;
  }

  addFilter(f) {
    console.log("Adding: ", f);
    this.db.serialize(() => {
      this.db.run(`INSERT INTO ${this.tableName} (name,message) VALUES(?,?)`, f.name, f.message);
    });

  }

  removeFilter(message) {
    console.log("Removing: ", message);
    this.db.serialize(() => {
      this.db.run(`DELETE FROM ${this.tableName} where message = ?`, message);
    });
  }
}

module.exports = FilterDAO;
