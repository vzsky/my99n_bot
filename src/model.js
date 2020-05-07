const mongoose = require('mongoose')

const User = mongoose.model('user', {
  userid: String,
  reminder: [String],
})

module.exports = { User }
