const { cherryBounce, gooseShock } = require('../sticker')
const { replyer } = require('../utils')

const welcome = replyer(() => cherryBounce)
const help = replyer(() => gooseShock)

const onSticker = (ctx) => {
  console.log(
    'sticker',
    ctx.message.sticker.file_id,
    'from',
    ctx.update.message.from.id
  )
}

module.exports = {
  main: (bot) => {
    bot.start(async (ctx) => welcome(ctx))
    bot.help(async (ctx) => help(ctx))
    bot.on('sticker', (ctx) => onSticker(ctx))
  },
}
