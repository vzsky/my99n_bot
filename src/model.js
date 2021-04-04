const mongoose = require('mongoose')

const User = mongoose.model('user', {
  userid: String,
  reminder: [String],
  events: Object,
})

const Subscription = mongoose.model('subscription', {
  name: String,
  userids: [Object],
})

const Binance = mongoose.model('binance', {
  name: String,
  object: Object
})

module.exports = { User, Subscription, Binance }
