const Telegraf = require('telegraf')
const mongoose = require('mongoose')
require('dotenv').config()

const useMain = require('./router/main')
const useReminder = require('./router/reminder')
const useFood = require('./router/food')

const bot = new Telegraf(process.env.TOKEN)

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to mongodb'))

useMain(bot)
useReminder(bot)
useFood(bot)

bot.launch()
