const mongoose = require('mongoose')

const User = mongoose.model('user', {
  userid: String,
  reminder: [String],
})

const Subscription = mongoose.model('subscription', {
  name: String,
  userids: [String],
})

module.exports = { User, Subscription }
