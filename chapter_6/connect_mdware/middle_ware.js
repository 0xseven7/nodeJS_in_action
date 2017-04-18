var connect = require('connect');
var app = connect();
app
  .use(connect.cookieParser('111222333'))
  .use(function (req, res) {
    console.log(req.cookies);
    console.log(req.signedCookies);
  });
app.listen(3000);