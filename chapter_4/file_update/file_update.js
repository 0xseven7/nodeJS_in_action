var http  = require('http');
var qs = require('querystring');
var fs = require('fs');

var formidable = require('formidable');
var server = http.createServer(function (req, res) {
  switch (req.method.toLowerCase()) {
    case 'get':
      show(res);
      break;
    case 'post':
      upload(req, res);
  }
});
function show(res) {
  fs.readFile('./index.html','utf8', function (err, data) {

    var html = data.toString();
    res.setHeader('Content-Type', 'text/html');
    // res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
  });
}
function upload(req, res) {
  if (!isFormData(req)) {
    res.statuscode = 400;
    res.end('Bad request: expecting multipart/form-data');
    return;
  }
  var form = new formidable.IncomingForm();
  form.parse(req);
  // form.on('field', function (field, value) {
  //   console.log(field);
  //   console.log(value);
  // });
  // form.on('file', function (name, file) {
  //   console.log(name);
  //   console.log(file                   );
  // });
  // form.on('end', function () {
  //   res.end('upload complete!');
  // });
  form.on('progress', function (received, all) {
    var persent = (received / all /2).toFixed(2) * 100 + '%';
    console.log(persent);
  });
  form.parse(req, function (err, field, files) {
    console.log(field);
    console.log(files);
    res.end('upload complete!')
  });

}
function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data');
}
server.listen('5000', function () {
  console.log('listening at 5000');
});