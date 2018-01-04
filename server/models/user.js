const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  avatar: String,
  age: String,
  homeAddress: String,
  telNo: String
})

var userModel = mongoose.model('user', userSchema)

module.exports = userModel
