var photos = [];
var Photo = require('../models/Photos');
var path = require('path');
var multiparty = require('multiparty');
var fs = require('fs');
var join = path.join;


exports.list = function (req, res, next) {
  Photo.find({}, function (err, photos) {
    if (err) {
      return next(err);
    }
    res.render('photos', {
      title: 'Photos',
      photos: photos
    });
  });
};

exports.form = function (req, res) {
  res.render('photos/upload', {
    title: 'Photos Upload'
  })
};
exports.submit = function (dir) {
  return function (req, res, next) {
    var form = new multiparty.Form();
    form.uploadDir = dir;
    form.parse(req, function (err, fields, file) {
      if (err) {
        return next(err);
      }
      var img = file.image[0];
      var imgName = img.originalFilename;
      var name = fields.name[0] || imgName;
      var path = join(dir, img.originalFilename);
      // var path = join(dir, img.name);
      // 由于orignalFileName是自动生成的, 这里就需要一个
      fs.rename(img.path, path, function (err) {
        if (err) {
          return next(err);
        }
        Photo.create({
          name: name,
          path: imgName
        }, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/photos');
        });
      })
    });
  }
};




































