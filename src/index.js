const Telegraf = require('telegraf')
const config = require('./utils')
const covid = require('./covid_router')
const codeforces = require('./codeforces_router')
require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN)

config(bot)

bot.on('sticker', (ctx) => console.log(ctx.message))

covid(bot)
codeforces(bot)

bot.launch()