const { Subscription } = require('../model')
const schedule = require('node-schedule')
const { menuWriter, getDate } = require('./food')

const query = async () => {
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
  let res = await query()

  let find = res.userids.filter((obj) => {
    return obj.id === id
  })

  if (find == null || find.length == 0)
    res.userids = [...res.userids, { id, last: null }]

  await update(res.userids)
}

const SendMenu = async (bot) => {
  let res = await query()

  for (ind in res.userids) {
    let user = res.userids[ind]
    let date = getDate()
    let msg = await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])

    if (user.last != null) await bot.telegram.deleteMessage(user.id, user.last)

    let sent = await bot.telegram.sendMessage(user.id, msg, {
      parse_mode: 'Markdown',
    })

    res.userids[ind] = { id: user.id, last: sent.message_id }
  }

  await update(res.userids)
}

const botSendMenu = (bot) => () => SendMenu(bot)

module.exports = {
  main: (bot) => {
    bot.hears('AutoFood', Subcribe)
    schedule.scheduleJob('0 0 23 * * *', botSendMenu(bot)) // UTC
    // schedule.scheduleJob('0 * * * * *', botSendMenu(bot)) // test
    // schedule.scheduleJob('30 * * * * *', botSendMenu(bot)) // test
  },
}
