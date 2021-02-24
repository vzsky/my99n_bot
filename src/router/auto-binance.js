const { Subscription } = require('../model')
const schedule = require('node-schedule')
const { checkAllSignal } = require('./binance')
const { boardcast, stampMaker } = require('../utils')

const BinanceSubscribers = async () => {
  let res = await Subscription.findOne({ name: 'Binance' })
  if (!res) res = { userids: [] }
  return res
}

const update = async (userids) => {
  return await Subscription.updateOne(
    { name: 'Binance' },
    { userids },
    { upsert: true }
  )
}

const Subcribe = async (ctx) => {
  let id = ctx.message.chat.id.toString()
  let res = await BinanceSubscribers()

  let find = res.userids.filter((obj) => {
    return obj.id === id
  })

  if (find == null || find.length == 0) res.userids = [...res.userids, id]

  await update(res.userids)
}

const SendUpdate = boardcast(async () => {
  let res = await BinanceSubscribers()
  let sending = []
  for (ind in res.userids) {
    let user = res.userids[ind]

    let msg = await checkAllSignal()

    let stamp = stampMaker({
      deleteWhen: 'binance',
      to: user,
      option: { parse_mode: 'Markdown' },
    })
    sending.push(stamp(msg))
  }
  return sending
})


module.exports = {
  main: (bot) => {
    // bot.hears('AutoBinance', Subcribe) Kinda private so no subscribe
    schedule.scheduleJob('1 0 * * * *', () => SendUpdate(bot)) // UTC
    // schedule.scheduleJob('30 * * * * *', () => SendMenu(bot)) // UTC
  },
}
