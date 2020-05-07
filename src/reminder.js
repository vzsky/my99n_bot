const { User } = require('./model')
const { porgWhat, cherryWink } = require('./sticker')

const list = async (ctx) => {
  let user = await User.findOne({ userid: ctx.update.message.from.id })
  if (!user || !user.reminder || !user.reminder.length) {
    return ctx.reply("*Don't forget to be happy*", { parse_mode: 'Markdown' })
  }
  var msg = '*Keep in mind!*\n'
  for (let todo of user.reminder) {
    msg += `- ${todo}\n`
  }
  return ctx.reply(msg, { parse_mode: 'Markdown' })
}

const done = async (ctx) => {
  let msg = ctx.update.message
  let which = msg.text.slice(6) // length of '/done '
  if (!which) return ctx.replyWithSticker(porgWhat)

  let user = await User.findOne({ userid: msg.from.id })
  if (!user) return ctx.replyWithSticker(cherryWink)
  if (which == 'all') user.reminder = []
  else {
    which = parseInt(which) - 1
    console.log(which)
    user.reminder.splice(which, 1)
  }
  await User.updateOne(
    { userid: msg.from.id },
    { reminder: user.reminder },
    { upsert: true }
  )
  return ctx.replyWithSticker(cherryWink)
}

const remind = async (ctx) => {
  let msg = ctx.update.message
  let todo = msg.text.slice(8) // length of '/remind '
  if (!todo) return ctx.replyWithSticker(porgWhat)

  let user = await User.findOne({ userid: msg.from.id })
  if (!user) user = { reminder: [] }
  await User.updateOne(
    { userid: msg.from.id },
    { reminder: [...user.reminder, todo] },
    { upsert: true }
  )
  return ctx.replyWithSticker(cherryWink)
}

module.exports = (bot) => {
  bot.command('remind', async (ctx) => remind(ctx))
  bot.command('list', async (ctx) => list(ctx))
  bot.command('done', async (ctx) => done(ctx))
}
