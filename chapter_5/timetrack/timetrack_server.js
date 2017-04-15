var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');
var db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'myUser',
  password: 'mypassword',
  database: 'timetrack'
});
db.connect();
var server = http.createServer(function (req, res) {
  switch (req.method.toLowerCase()) {
    case 'post':
      switch (req.url) {
        case '/':
          work.add(db, req, res);
          break;
        case '/archive':
          work.archived(db, req, res);
          break;
        case '/delete':
          work.delete(db, req, res);
          break;
        default:
          work.badRequest(res);
          break;
      }
    break;
    case 'get':
      switch (req.url) {
        case '/':
          work.show(db, res);
          break;
        case '/archived':
          work.showArchived(db, res);
          break;
        default:
          work.badRequest(res);
      }
    break;
    default:
      work.badRequest(res);
  }
});
db.query('CREAT TABLE IF NOT EXISTS work ('
  + 'id INT(10) NOT NULL AUTO_INCREMENT'
  + 'hours DECIMAL(5, 2) DEFAULT 0,'
  + 'date DATE'
  + 'archived INT(1) DEFAULT 0'
  + 'decription LONGTEXT'
  + 'PRIMARY KEY(id)',
  function (err) {
    if (err) {
      throw err
    }
    console.log('server started...');
    server.listen(3000, '127, 0, 0, 1');
  }
);