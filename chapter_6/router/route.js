var app = require('connect')();
var router = require('./middleware/router');
var routes = {
  GET: {
    '/users': function (req, res) {
      res.end('zz, cc, xx')
    },
    '/user/:id': function (req, res, id) {
      res.end('user ' + id)
    }
  },
  DELETE: {
    '/user/id': function (req, res, id) {
      res.end('delete user ' + id);
    }
  }};
app.use(router(routes)).listen(3000);