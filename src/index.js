const Telegraf = require('telegraf')
const mongoose = require('mongoose')
require('dotenv').config()

const useMain = require('./router/main').main
const useReminder = require('./router/reminder').main
const useFood = require('./router/food').main
const useAutoFood = require('./router/auto-food').main
const useBinance = require('./router/binance').main
const useAutoBinance = require('./router/auto-binance').main

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
useAutoFood(bot)
useBinance(bot)
useAutoBinance(bot)

bot.launch()
