const covid = require('./covid')

const covidEx = new RegExp('\s*covid\s*')

module.exports = (bot) => {
    bot.hears('covid thailand',
        async (ctx) => covid.thai(ctx)
    )
    bot.hears(covidEx,
        async (ctx) => covid.all(ctx)
    )
}