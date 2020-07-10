const { getapi, messenger, stamper, stampMaker } = require('./utils')
const moment = require('moment')
const { porgWhat } = require('./sticker')

const api = 'https://food-fetcher-bot.herokuapp.com/api/'

const timeToEat = {
  Breakfast: 9,
  Lunch: 13,
  Dinner: 20,
}

const text = stampMaker('md')

const getDate = () => moment().utcOffset(7)
const getTime = () => moment().utcOffset(7).hour()

const addToMenu = (dishes, type) => {
  s = +type + '\n'
  for (dish of dishes) {
    s += '- ' + dish + '\n'
  }
  s += '\n'
  return s
}

const menuWriter = async (date, periods) => {
  let res = await getapi(api + date.format('M-D-YYYY'))
  let s = '*Menu for ' + date.format('dddd') + '*\n\n'
  for (period of periods) {
    s += addToMenu(res[period], period)
  }
  return text(s)
}

const menu = messenger(async () => {
  let date = getDate()
  return await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])
})

const tomorrow = messenger(async () => {
  let date = getDate().add(1, 'd')
  return await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])
})

const meal = (period) => {
  return messenger(async () => {
    let date = getDate()
    if (getTime() >= timeToEat[period]) date = date.add(1, 'd')
    return await menuWriter(date, [period])
  })
}

const next = messenger(async () => {
  let date = getDate()
  for (period of ['Breakfast', 'Lunch', 'Dinner']) {
    if (getTime() < timeToEat[period]) return await menuWriter(date, [period])
  }
  return await menuWriter(date.add(1, 'd'), ['Breakfast'])
})

const breakfast = meal('Breakfast')
const lunch = meal('Lunch')
const dinner = meal('Dinner')

const foodCommand = {
  menu,
  breakfast,
  lunch,
  dinner,
  tomorrow,
  next,
}

const food = async (ctx) => {
  let msg = ctx.update.message
  let cmd = msg.text.slice(6) // length of '/food '
  if (foodCommand[cmd] == null) return ctx.replyWithSticker(porgWhat)
  foodCommand[cmd](ctx)
}

module.exports = (bot) => {
  bot.command('food', async (ctx) => food(ctx))
}
