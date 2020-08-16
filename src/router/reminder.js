const { User } = require('../model')
const { porgWhat, cherryWink } = require('../sticker')
const { replyer, stampMaker, removeAndRun } = require('../utils')

const text = stampMaker({ type: 'md', kind: 'remind', deleteWhen: 'remind' })

const fetchList = async (userid) => {
  let user = await User.findOne({ userid })
  if (!user || !user.reminder || !user.reminder.length) {
    return text("*Don't forget to be happy*")
  }
  var msg = '*Keep in mind!*\n'
  for (let todo of user.reminder) {
    msg += `- ${todo}\n`
  }
  return text(msg)
}

const list = replyer(async (ctx) => {
  return await fetchList(ctx.update.message.from.id)
})

const done = replyer(async (ctx) => {
  let msg = ctx.update.message
  let which = msg.text.slice(6) // length of '/done '
  if (!which) return porgWhat

  let user = await User.findOne({ userid: msg.chat.id })
  if (!user) return cherryWink
  if (which == 'all') user.reminder = []
  else {
    which = parseInt(which) - 1
    user.reminder.splice(which, 1)
  }
  await User.updateOne({ userid: user.userid }, user, { upsert: true })
  return await fetchList(user.userid)
})

const remind = replyer(async (ctx) => {
  let msg = ctx.update.message
  let todo = msg.text.slice(8) // length of '/remind '
  if (!todo) return porgWhat

  let user = await User.findOne({ userid: msg.chat.id })
  if (!user) user = { reminder: [] }
  if (!user.reminder) user.reminder = []
  user.reminder = [...user.reminder, todo]
  await User.updateOne({ userid: user.userid }, user, { upsert: true })
  return await fetchList(user.userid)
})

module.exports = {
  main: (bot) => {
    bot.command('remind', async (ctx) => removeAndRun(ctx, remind))
    bot.command('list', async (ctx) => removeAndRun(ctx, list))
    bot.command('done', async (ctx) => removeAndRun(ctx, done))
  },
}
