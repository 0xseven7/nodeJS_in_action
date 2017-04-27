var fs = require('fs');
var http = require('http');
var path = require('path');
var mime = require('mime');
var chat_server = require('./lib/chat_server');


var join = path.join;
var cache = {};

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Error 404: resource not found ');
}
function sendFile(res, filePath, fileContent) {
  res.writeHead(200, {
    'Content-type': mime.lookup(path.basename(filePath))
  });
  res.end(fileContent);
}
function serverStatic(res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exist) {
      if (exist) {
        fs.readFile(absPath, function (err, data) {
          if (err) {
            send404(res);
          } else {
            cache[absPath] = data;
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
}
var server = http.createServer(function (req, res) {
  var filePath = '';
  if (req.url === '/') {
    filePath = '/public/index.html';
  } else {
    filePath = '/public' + req.url;
  }
  var absPath = __dirname + filePath;
  serverStatic(res, cache, absPath);
});
server.listen('5000', function () {
  console.log('listening at 5000');
});
chat_server.listen(server);