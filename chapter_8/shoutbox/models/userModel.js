var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/shoutbox');
var userSchema = mongoose.Schema({
  name: String,
  pass: String,
  age: Number
});
module.exports = mongoose.model('userModel', userSchema);


