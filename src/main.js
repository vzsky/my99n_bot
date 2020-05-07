const { cherryBounce, gooseShock } = require('./sticker')
const welcome = async (ctx) => {
  ctx.replyWithSticker(cherryBounce)
}

const help = async (ctx) => {
  ctx.replyWithSticker(gooseShock)
}

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
