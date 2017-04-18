var connect =require('connect');

var api = connect()
  .use(users)
  .use(pets)
  .use(errHandler);

var app = connect()
  .use(hello)
  .use('/api', api)
  .use(errorPage)
  .listen(3000);

function hello(req, res, next) {
  if (req.url.match(/^\/hello/)) {
    res.end('Hello world!');
  } else {
    next();
  }
}
var db = {
  users: [
    {name: 'tobi'},
    {name: 'zzz'},
    {name: 'zzz'}
  ]
};
function users(req, res, next) {
  var match = req.url.match(/\/user\/(.+)/);
  if (match) {
    var user = db.users[match[1]];
  }
}
