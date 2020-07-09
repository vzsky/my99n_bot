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
    ctx.reply(reply, { parse_mode: 'Markdown' })
  }
}

module.exports = { getapi, messenger }
