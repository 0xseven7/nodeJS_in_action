var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST':
      var item = '';
      req.on('data', function (chunk) {
        item += chunk.toString();
      });
      req.on('end', function () {
        items.push(item);
        res.end('add item succeed!\n')
      });
      break;
    case 'GET':
      var body = items.map(function (item, i) {
        return i + '> ' + item;
      }).join('\n');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Conteng-Type', 'text/plain; charset="utf-8"');
      res.end(body);
      break;
    case 'DELETE':
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);
      if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if (!item[i]) {
        res.statusCode = 404;
        res.end('Item not found');
      } else{
        res.end('Deleted' + i + '> ' + items.splice(i, 1) + '\n');
      }
  }
});
server.listen(3000, function () {
  console.log('listenning at 3000');
});
