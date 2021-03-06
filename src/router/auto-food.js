// kvis food

const { Subscription } = require('../model')
const schedule = require('node-schedule')
const { menuWriter, getDateOfNextMeal } = require('./food')
const { boardcast, stampMaker, TesterList } = require('../utils')

const AutoFoodSubscribers = async () => {
  let res = await Subscription.findOne({ name: 'AutoFood' })
  if (!res) res = { userids: [] }
  return res
}

const update = async (userids) => {
  return await Subscription.updateOne(
    { name: 'AutoFood' },
    { userids },
    { upsert: true }
  )
}

const Subcribe = async (ctx) => {
  let id = ctx.message.chat.id.toString()
  let res = await AutoFoodSubscribers()

  let find = res.userids.filter((obj) => {
    return obj.id === id
  })

  if (find == null || find.length == 0) res.userids = [...res.userids, id]

  await update(res.userids)
}

const SendMenu = boardcast(async () => {
  let res = await AutoFoodSubscribers()
  let sending = []
  for (ind in res.userids) {
    let user = res.userids[ind]
    let date = getDateOfNextMeal()
    let msg = await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])

    let stamp = stampMaker({
      deleteWhen: 'menu',
      to: user,
      option: { parse_mode: 'Markdown' },
    })
    sending.push(stamp(msg))
  }
  return sending
})

const SendTestMenu = boardcast(async () => {
  let res = await TesterList()
  let sending = []
  for (ind in res.userids) {
    let user = res.userids[ind]
    let date = getDateOfNextMeal()
    let msg = await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])

    let stamp = stampMaker({
      deleteWhen: 'menu',
      to: user,
      option: { parse_mode: 'Markdown' },
    })
    sending.push(stamp(msg))
  }
  return sending
})

module.exports = {
  main: (bot) => {
    bot.hears('AutoFood', Subcribe)
    schedule.scheduleJob('1 0 14 * * *', () => SendMenu(bot)) // UTC
    // schedule.scheduleJob('30 * * * * *', () => SendMenu(bot)) // UTC
    // bot.hears('test', () => SendTestMenu(bot))
  },
}
