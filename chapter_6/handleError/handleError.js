var connect = require('connect');
var app = connect();
app.listen(3000);
app
  .use(sayHello)
  .use(errorHandler());
function sayHello(req, res, next) {
  foo();
  res.end('hello world');
}
function errorHandler() {
  var env = process.env.NODE_ENV || 'dev';
  return function (err, req,  res, next) {
    res.statusCode = 500;
    switch(env) {
      case 'dev':
        res.setHeader('Content-Type', 'text/plain');
        res.end(err.stack);
        break;
      default:
        res.end('Server error');
    }
  }
}