var connect = require('connect');
var url =require('connect');
var app = connect();
app.listen(3000);
app
  .use(rewrite)
  .use(showPost)
  .listen(3000);
function rewrite(req, res, next) {
  var path = url.parse(req.url).pathname;
  var match = path.match(/^\/blog\/posts\/(.+)/);
  if (match) {
    findPostIdBySlug(match[i], function (err, id) {
      if (err) {
        return next(err);
      }
      if (!id) {
        return next(new Error('User is not found'));
      }
      req.url = '/blog/posts/' + id;
    });
  } else {
    next();
  }
}

