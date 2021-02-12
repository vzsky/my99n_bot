const { getapi, replyer, stampMaker, removeAndRun } = require('../utils')
const moment = require('moment')
const { porgWhat, stickerSender } = require('../sticker')

const api = 'https://food-fetcher-bot.herokuapp.com/api/'

const timeToEat = {
  Breakfast: 9,
  Lunch: 13,
  Dinner: 20,
}
lastMealDaily = 'Dinner'

const text = stampMaker({ type: 'md', kind: 'food', deleteWhen: 'menu' })

const getDate = () => moment().utcOffset(7)
const getTime = () => moment().utcOffset(7).hour()
const getDateOfNextMeal = () => {
  if (timeToEat[lastMealDaily] < getTime()) return getDate().add(1, 'd')
  return getDate()
}

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

const menu = replyer(async () => {
  let date = getDate()
  return text(await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner']))
})

const tomorrow = replyer(async () => {
  let date = getDate().add(1, 'd')
  return text(await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner']))
})

const meal = (period) => {
  return replyer(async () => {
    let date = getDate()
    if (getTime() >= timeToEat[period]) date = date.add(1, 'd')
    return text(await menuWriter(date, [period]))
  })
}

const next = replyer(async () => {
  let date = getDate()
  for (period of ['Breakfast', 'Lunch', 'Dinner']) {
    if (getTime() < timeToEat[period]) return await menuWriter(date, [period])
  }
  return text(await menuWriter(date.add(1, 'd'), ['Breakfast']))
})

const breakfast = meal('Breakfast')
const lunch = meal('Lunch')
const dinner = meal('Dinner')

const help = replyer(async () => {
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
  if (foodCommand[cmd] == null) return stickerSender(porgWhat)(ctx)
  await foodCommand[cmd](ctx)
}

module.exports = {
  main: (bot) => {
    bot.command('food', async (ctx) => removeAndRun(ctx, food))
  },
  menuWriter,
  getDateOfNextMeal
}
