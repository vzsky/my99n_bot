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

const getUserByID = async (userid) => {
  let user = await User.findOne({ userid })
  if (!user) user = { events: {}, reminder: [] }
  if (!user.events) user.events = []
  return user
}

const deleteMessage = (bot, user, del) => {
  if (user.events[del]) {
    for (msg of user.events[del]) {
      try {
        bot.telegram.deleteMessage(user.userid, msg)
      } catch (e) {
        console.log('Delete failed : ', e)
      }
    }
  }
}

const boardcast = (func) => {
  return async (bot) => {
    let replies = await func()

    for (rep of replies) {
      let s = rep.stamp
      let del = s.deleteWhen
      let user = await getUserByID(s.to)

      deleteMessage(bot, user, del)

      var msg = await bot.telegram.sendMessage(user.userid, rep.val, s.option)

      user.events[del] = []
      user.events[del].push(msg.message_id)

      await User.updateOne({ userid: user.userid }, user, { upsert: true })
    }
  }
}

const replyStampHandler = async (ctx, rep) => {
  let s = rep.stamp

  if (s.type === 'plain') {
    return await ctx.reply(rep.val)
  }

  if (s.type === 'md') {
    return await ctx.reply(rep.val, { parse_mode: 'Markdown' })
  }

  if (s.type === 'sticker') {
    return await ctx.replyWithSticker(rep.val)
  }
}

const replyer = (func) => {
  return async (ctx) => {
    let rep = await func(ctx)
    let s = rep.stamp
    let del = s.deleteWhen

    let user = await getUserByID(ctx.message.chat.id)

    deleteMessage(ctx, user, del)

    let msg = await replyStampHandler(ctx, rep)

    user.events[del] = []
    user.events[del].push(msg.message_id)

    await User.updateOne({ userid: user.userid }, user, { upsert: true })
  }
}

const stampMaker = (stamp) => {
  return (val) => {
    return { stamp, val }
  }
}

const removeAndRun = async (ctx, func) => {
  ctx.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
  return await func(ctx)
}

module.exports = { getapi, replyer, boardcast, stampMaker, removeAndRun }
