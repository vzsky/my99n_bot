const { cherryBounce, gooseShock } = require('./sticker')
const { messenger } = require('./utils')

const welcome = messenger(() => cherryBounce)
const help = messenger(() => gooseShock)

const onSticker = (ctx) => {
  console.log(
    'sticker',
    ctx.message.sticker.file_id,
    'from',
    ctx.update.message.from.id
  )
}

module.exports = (bot) => {
  bot.start(async (ctx) => welcome(ctx))
  bot.help(async (ctx) => help(ctx))
  bot.on('sticker', (ctx) => onSticker(ctx))
}
