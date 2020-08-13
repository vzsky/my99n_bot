const { Subscription } = require('../model')
const schedule = require('node-schedule')
const { menuWriter, getDate } = require('./food')
const { messenger, stampMaker } = require('../utils')

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

  if (find == null || find.length == 0) res.userids = [...res.userids, id]

  await update(res.userids)
}

const SendMenu = messenger(async () => {
  let res = await query()
  let sending = []
  for (ind in res.userids) {
    let user = res.userids[ind]
    let date = getDate()
    let msg = await menuWriter(date, ['Breakfast', 'Lunch', 'Dinner'])

    let stamp = stampMaker({
      deleteWhen: 'menu',
      type: 'sendTo',
      id: user,
      option: { parse_mode: 'Markdown' },
    })
    sending.push(stamp(msg))
  }
  return sending
})

module.exports = {
  main: (bot) => {
    bot.hears('AutoFood', Subcribe)
    schedule.scheduleJob('0 0 14 * * *', SendMenu) // UTC
    // bot.hears('test', SendMenu)
  },
}
