const cf = require('cf-api-wrapper');

const info = async (ctw, handle='my99n') => {
    let user = await cf.user.info({handles: handle})
    if (user.status == "FAILED") {
        return ctw.reply("Nah. I won't tell you.")
    }
    user = user.result[0]
    if (user.rating === undefined) {
        return ctw.reply(`${handle}'s rating is still undefined`)
    }
    ctw.reply(`${user.rank} ${handle}'s rating is now ${user.rating}`)
}

module.exports = {
    info: info,
}