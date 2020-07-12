const { User } = require('../model')
const { porgWhat, cherryWink } = require('../sticker')
const { messenger, stampMaker } = require('../utils')

const text = stampMaker('md')

const list = messenger(async (ctx) => {
  let user = await User.findOne({ userid: ctx.update.message.from.id })
  if (!user || !user.reminder || !user.reminder.length) {
    return text("*Don't forget to be happy*")
  }
  var msg = '*Keep in mind!*\n'
  for (let todo of user.reminder) {
    msg += `- ${todo}\n`
  }
  return text(msg)
})

const done = messenger(async (ctx) => {
  let msg = ctx.update.message
  let which = msg.text.slice(6) // length of '/done '
  if (!which) return porgWhat

  let user = await User.findOne({ userid: msg.from.id })
  if (!user) return cherryWink
  if (which == 'all') user.reminder = []
  else {
    which = parseInt(which) - 1
    user.reminder.splice(which, 1)
  }
  await User.updateOne(
    { userid: msg.from.id },
    { reminder: user.reminder },
    { upsert: true }
  )
  return cherryWink
})

const remind = messenger(async (ctx) => {
  let msg = ctx.update.message
  let todo = msg.text.slice(8) // length of '/remind '
  if (!todo) return porgWhat

  let user = await User.findOne({ userid: msg.from.id })
  if (!user) user = { reminder: [] }
  await User.updateOne(
    { userid: msg.from.id },
    { reminder: [...user.reminder, todo] },
    { upsert: true }
  )
  return cherryWink
})

module.exports = {
  main: (bot) => {
    bot.command('remind', async (ctx) => remind(ctx))
    bot.command('list', async (ctx) => list(ctx))
    bot.command('done', async (ctx) => done(ctx))
  },
}
