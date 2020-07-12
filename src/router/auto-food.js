const { Subscription } = require('../model')
const schedule = require('node-schedule')
const { menuWriter, getDate } = require('./food')

const Subcribe = async (ctx) => {
  let id = ctx.message.chat.id.toString()
  let res = await Subscription.findOne({ name: 'AutoFood' })

  if (!res) res = { userids: [] }
  if (!res.userids.includes(id)) res.userids = [...res.userids, id]
  await Subscription.updateOne(
    { name: 'AutoFood' },
    { userids: res.userids },
    { upsert: true }
  )
}

const SendMenu = async (bot) => {
  let res = await Subscription.findOne({ name: 'AutoFood' })
  if (!res) res = { userids: [] }
  for (user of res.userids) {
    let date = getDate()
    let msg = await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])
    bot.telegram.sendMessage(user, msg, { parse_mode: 'Markdown' })
  }
}

const botSendMenu = (bot) => {
  return () => SendMenu(bot)
}

module.exports = {
  main: (bot) => {
    bot.hears('AutoFood', Subcribe)
    schedule.scheduleJob('6 * * *', botSendMenu(bot))
    // schedule.scheduleJob('1 * * * * *', botSendMenu(bot))
    schedule.scheduleJob('0 * * * * *', (time) => {
      console.log(time)
    })
  },
}
