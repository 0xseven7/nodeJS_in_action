var connect = require('connect');
var app = connect();
app.listen(3000);

function setup(format) {
  var regexp = '/:(\w+)/g';
  return function (req, res, next) {
    var str = format.replace(regexp, function (match, property) {
      return req[property]
    });
    console.log(str);
    next();
  }
}
app.use(setup(':method :url'));