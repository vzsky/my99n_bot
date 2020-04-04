const welcome = async (ctx) => {
    ctx.replyWithSticker('CAACAgIAAxkBAANKXogv4knCS-h3ljVtVbQz5X0iRP8AAgUAA8A2TxP5al-agmtNdRgE')
}

const help = async (ctx) => {
    ctx.replyWithSticker('CAACAgIAAxkBAANAXohGAAFk8OOXNwaDXiiGmHUVpCP7AAJCAANSiZEjg8hUYzO75FkYBA')
}

const route = (bot) => {
    bot.start(
        async (ctx) => welcome(ctx)
    )
    bot.help(
        async (ctx) => help(ctx)
    )
}

module.exports = route