var http = require('http');
var fs = require('fs');
var items = [122, 4566];

http.createServer(function (req, res) {
  if (req.url === '/') {
    switch (req.method) {
      case 'GET':
        showItems(res);
        break;
      case 'POST':
        addItems(req, res);
        break;
      default:
        badRequest(res);
    }
  } else {
    send404(res);
  }
}).listen(5000, function () {
  console.log('listenning at 5000');
});
var qs = require('querystring');
function badRequest(res) {
  res.statuscode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request!');
}
function send404(res) {
  res.statuscode = 404;
  res.end('Not Found');
}
function addItems(req, res) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk;
    console.log(chunk);
  });
  req.on('end', function () {
    var obj = qs.parse(body);
    items.push(obj.item);
    showItems(res);
  })
}
function showItems(res) {
  fs.readFile('./todo.html', 'utf-8', function (err, data) {
    if (err) {
      send404(res);
    }
    var html = data.toString();
    var list = '';
    if (items.length === 0) {
      list = 'There is no item, place add a item';
    } else {
      items.forEach(function (item) {
        list += '<li>' + item + '</li>\n'
      });
    }
    html = html.replace('%', list);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
  })
}
