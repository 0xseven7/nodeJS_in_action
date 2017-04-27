var Photo = require('../../models/Photos');
var fs = require('fs');
var join = require('path').join;
var multiparty  = require('multiparty');
exports.list = function (req, res, next) {
  Photo.find({}, function (err, photos) {
    if (err) {
      return next(err);
    }
    res.render('photos', {
      title: 'Photos',
      photos: photos
    })
  });
};
exports.submit = function (dir) {
  return function (req, res, next) {
    var form = new multiparty.Form({
      autoFiles: true,
      uploadDir: dir
    });
    form.parse(req, function (err, fields, files) {if (err) {
        return next(err);
      }
      var img = files.imgPath[0];
      var type = '.' + img.headers['content-type'].split('/')[1];
      var name = fields.imgName[0] ? fields.imgName[0] + type : img.originalFilename;
      var path = join(dir, name);
      fs.rename(img.path, path, function (err) {
        if (err) {
          return next(err);
        }
        Photo.create({
          name: name,
          path: '/photosDir/' + name
        }, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/photos');
        });
      })
    })
  };
};
exports.form = function (req, res) {
  res.render('photos/upload', {
    title: 'Photos upload'
  })
};