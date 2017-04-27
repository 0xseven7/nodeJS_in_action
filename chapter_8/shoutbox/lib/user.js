var bcrypt = require('bcrypt');
var userDB = require('../models/userModel');
module.exports = User;
function User(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}
User.prototype.save = function (fn) {
  if (this.id) {
    this.update(fn);
  } else {
    var user = this;
    userDB.create('user:ids', function (err, id) {
      if (err) {
        return fn(err);
      }
      user.id = id;
      user.hashPassWord(function (err) {
        if (err) {
          return fn(err);
        }
        user.update(fn);
      })
    })
  }
};
User.prototype.update = function (fn) {
  var user = this;
  var id = user.id;
  db.set('user:id', user.name, id, function (err) {
    if (err) {
      return fn(err);
    }
    db.hmset('user' + id.user, function (err) {
      return fn(err);
    })
  })
};
User.prototype.hashPassWord = function (fn) {
  var user = this;
  // 生成12字符的salt
  bcrypt.genSalt(12, function (err, salt) {
    if (err) {
      return fn(err);
    }
    user.salt = salt;
    bcrypt.hash(user.pass, salt, function (err, hash) {
      if (err) {
        return fn(err);
      }
      user.pass = hash;
      fn(0);
    });
  });
};
var tobi = new User({
  name: 'Tobi',
  pass: 'im a ferret',
  age: '22'
});
tobi.save(function (err) {
  if (err) {
    throw err;
  }
  console.log('user id ' + tobi.id);
});


