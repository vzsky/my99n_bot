const cf = require('./codeforces')

const codeforcesEx = new RegExp('(codeforces) (.*)')

module.exports = (bot) => {
    bot.hears(codeforcesEx,
        async (ctx) => cf.info(ctx, ctx.match[2])
    )
}