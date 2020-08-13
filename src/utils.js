const fetch = require('node-fetch')
const { User } = require('./model')

const getapi = async (path) => {
  try {
    let res = await fetch(path)
    let json = await res.json()
    return json
  } catch (e) {
    return
  }
}

const messenger = (func) => {
  return async (ctx) => {
    let replies = await func(ctx)
    if (!(replies instanceof Array)) replies = [replies]

    let userid = ctx.message.chat.id
    let user = await User.findOne({ userid })
    if (!user) user = { events: {} }
    if (!user.events) user.events = {}

    for (rep of replies) {
      let s = rep.stamp
      let del = s.deleteWhen
      if (user.events[del]) {
        for (msg of user.events[del]) {
          try {
            ctx.telegram.deleteMessage(userid, msg)
          } catch (e) {}
        }
      }
      user.events[del] = []
    }

    for (rep of replies) {
      let s = rep.stamp
      var msg
      if (s.type === 'sendTo') {
        msg = await ctx.telegram.sendMessage(s.id, rep.val, s.option)
      }
      if (s.type === 'plain') {
        msg = await ctx.reply(rep.val)
      }
      if (s.type === 'md') {
        msg = await ctx.reply(rep.val, { parse_mode: 'Markdown' })
      }
      if (s.type === 'sticker') {
        msg = await ctx.replyWithSticker(rep.val)
      }

      let del = s.deleteWhen
      if (!user.events[del]) user.events[del] = []
      user.events[del].push(msg.message_id)
    }

    await User.updateOne({ userid: msg.chat.id }, user, { upsert: true })
  }
}

const stampMaker = (stamp) => {
  return (val) => {
    return { stamp, val }
  }
}

const commandRemover = async (ctx, func) => {
  ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
  return await func(ctx)
}

module.exports = { getapi, messenger, stampMaker, commandRemover }
