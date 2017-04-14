// var http = require('http');
// var parser = require('url').parse;
// var join = require('path').join;
// var fs = require('fs');
//
// var root = __dirname;
// var server = http.createServer(function (req, res) {
//   var url = parser(req.url);
//   var path = join(root, url.pathname);
//   // stream.on('data', function (chunk) {
//   //   res.write(chunk);
//   // });
//   // stream.on('end', function () {
//   //   res.end();
//   // })
//   // req.pipe(fs.createWriteStream(path));
//   // stream.pipe(res);
//   // stream.on('error', function (err) {
//   //   res.statusCode = 500;
//   //   res.end('Internal Server error');
//   // })
//   fs.stat(path, function (err, status) {
//     if (err) {
//       if (err.code ==='ENOENT') {
//         res.statusCode = 404;
//         res.end('404: File Not Found');
//       } else {
//         res.statusCode = 500;
//         res.end('Internal Error');
//       }
//     } else {
//       res.setHeader('Content-Length', status.size);
//       var stream = fs.createReadStream(path);
//       stream.pipe(res);
//       stream.on('error', function () {
//         res.statusCode = 500;
//         res.end('Internal Error');
//       })
//     }
//   })
// });
// server.listen(5000, function () {
//   console.log('listening at 5000');
// });
var http = require('http');
http.createServer(function (req, res) {
  req.on('data', function (chunk) {
    console.log(chunk);
  });
  req.on('end', function () {
    res.end('123');
  })
}).listen(6000, function () {
  console.log('listening at 6000');
});
