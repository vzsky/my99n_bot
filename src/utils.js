const fetch = require('node-fetch')

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
    let reply = await func(ctx)
    if (reply.stamp === 'text') ctx.reply(reply.val)
    if (reply.stamp === 'md') ctx.reply(reply.val, { parse_mode: 'Markdown' })
    if (reply.stamp === 'sticker') ctx.replyWithSticker(reply.val)
  }
}

const stampMaker = (stamp) => {
  return (val) => {
    return { stamp, val }
  }
}

module.exports = { getapi, messenger, stampMaker }
