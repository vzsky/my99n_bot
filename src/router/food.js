const { getapi, messenger, stamper, stampMaker } = require('../utils')
const moment = require('moment')
const { porgWhat } = require('../sticker')

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
  s = type + '\n'
  for (dish of dishes) {
    s += '- ' + dish + '\n'
  }
  s += '\n'
  return s
}

const menuWriter = async (date, periods) => {
  let res = await getapi(api + date.format('M-D-YYYY'))
  if (!res) return text('Api down')
  let s = '*Menu for ' + date.format('dddd') + '*\n\n'
  for (period of periods) {
    s += addToMenu(res[period], period)
  }
  return s
}

const menu = messenger(async () => {
  let date = getDate()
  return text(await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner']))
})

const tomorrow = messenger(async () => {
  let date = getDate().add(1, 'd')
  return text(await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner']))
})

const meal = (period) => {
  return messenger(async () => {
    let date = getDate()
    if (getTime() >= timeToEat[period]) date = date.add(1, 'd')
    return text(await menuWriter(date, [period]))
  })
}

const next = messenger(async () => {
  let date = getDate()
  for (period of ['Breakfast', 'Lunch', 'Dinner']) {
    if (getTime() < timeToEat[period]) return await menuWriter(date, [period])
  }
  return text(await menuWriter(date.add(1, 'd'), ['Breakfast']))
})

const breakfast = meal('Breakfast')
const lunch = meal('Lunch')
const dinner = meal('Dinner')

const help = messenger(async () => {
  return text('subcommands are menu, breakfast, lunch, dinner, tommorrow, next')
})

const foodCommand = {
  menu,
  breakfast,
  lunch,
  dinner,
  tomorrow,
  next,
  help,
}

const food = async (ctx) => {
  let msg = ctx.update.message
  let cmd = msg.text.slice(6) // length of '/food '
  if (foodCommand[cmd] == null) return ctx.replyWithSticker(porgWhat.val)
  foodCommand[cmd](ctx)
}

module.exports = {
  main: (bot) => {
    bot.command('food', async (ctx) => food(ctx))
  },
  menuWriter,
  getDate,
}
