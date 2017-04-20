var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/photo_app');

// 注册schema
var photoSchema = mongoose.Schema({
  name: String,
  path: String
});
module.exports = mongoose.model('Photo', photoSchema);