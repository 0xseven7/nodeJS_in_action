var qs = require('querystring');
exports.sendHtml = function (res, html) {
  res.setHeader('content-type', 'text/html;charset=utf8');
  res.setHeader('content-length', Buffer.byteLength(html));
  res.end(html)
};
exports.parseReceivedData = function (req, cb) {
  var body = '';
  req.on('data', 'utf8', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    var data = qs.parse(body);
    cb(data);
  })
};
exports.actionForm = function (id, path, label) {
  var html = '<form method="post" action="' + path + '">'
    + '<input type="hidden" name="id" value="' + id + '">'
    + '<input type="submit" value="submit" value=" ' + label + '">'
    + '</form>'
};
exports.add = function (db, req, res) {
  exports.parseReceivedData(req, function (work) {
    db.query(
      'INSERT INTO work (hours, date, description)'
      + 'VALUE (?, ?, ?)',
      [work.hours, work.date, work.description],
      function (err) {
        if (err) {
          throw err;
        }
        exports.show(db, res);
      }
    )
  })
};
exports.delete = function (db, req, res) {
 exports.parseReceivedData(req, function (work) {
   db.query(
     'DELETE FROM work WHERE id=?',
     [work.id],
     function (err) {
       if (err) {
         throw err;
       }
       exports.show(db, res);
     }
   )
 })
};
exports.archived = function (db, req, res) {
  exports.parseReceivedData(req, function (work) {
    db.query(
      'UPDATE work SET archived=1 WHERE id=?',
      [work.id],
      function (err) {
        if (err) {
          throw err;
        }
        exports.show(db, res);
      }
    )
  })
};
exports.show = function (db, res, showArchived) {
  var query = 'SELECT * FORM work WHERE archived=? ORDER BY date DESC';
  var archiveValue = (showArchived) ? 1: 0;
  db.query(
    query,
    [archiveValue],
    function (err, rows) {
      if (err) {
        throw err;
      }
      var html = (showArchived) ? '' :
        '<a href="/achived">Archived Work</a>';
      html += exports.workHitlistHtml(rows);
      html += exports.workFormHtml();
      exports.sendHtml(res, html)
    }
  )
};
exports.workHitlistHtml = function (rows) {
  var html = '<table>';
  var row = '<td>%</td>';
  for (var i in rows) {
    html += '<tr>';
    html += row.replace('%', rows[i].date);
    html += row.replace('%', rows[i].hours);
    html += row.replace('%', rows[i].decription);
    if (!rows[i].archived) {
      html += row.replace('%', exports.workArchiveForm(rows[i].id));
    }
    html += row.replace('%', exports.workDeleteForm(rows[i].id));
    html += '</tr>';
  }
  html += "</table>";
  return html;
};
exports.workFormHtml = function () {
  var html =
      '<form method="post" action="/">'
    + '<p>Date (YYYY-MM-DD): <br><input type="text" name="date" type="text">'
    + '<p>Hours worked: <br><input type="text" name="hours"></p>'
    + '<p>Decription: <br></p>'
    + '<textarea name="decription" cols="30" rows="10"></textarea>'
    + '<input type="submit" value="Add">'
    + '</form>'
};
exports.workArchiveForm = function (id) {
  return exports.actionForm(id, '/archive', 'Archive');
};
exports.workDeleteForm = function (id) {
  return exports.actionForm(id, '/delete', 'Delete');
};