const WebSocket = require('ws')
const { Binance } = require('../model')

let price = {}

const getTreshold = async () => {
  let res = await Binance.findOne({ name: 'treshold' })
  if (!res) res = { object: {} }
  return res.object
}

const updateTreshold = async (object) => {
  return await Binance.updateOne(
    { name: 'treshold' },
    { object },
    { upsert: true }
  )
}

let conn = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr")
conn.on('error', async (data) => {
  console.log(data);
});

const onMessage = async (bot) => {
  conn.on('message', async (data) => {
    let d = JSON.parse(data)
    for (let symbol of d) {
      price[symbol.s] = parseFloat(symbol.c)
    }

    let treshold = await getTreshold()

    for (let symbol in treshold) {
      for (let index in treshold[symbol]) {
        let tres = treshold[symbol][index]
        if (tres.opr == '<') {
          if (price[symbol] < tres.prc) {
            bot.telegram.sendMessage(tres.user, `${symbol} @ ${price[symbol]}`)
            treshold[symbol].splice(index, 1);

            await updateTreshold(treshold)
          }
        }
        if (tres.opr == '>') {
          if (price[symbol] > tres.prc) {
            bot.telegram.sendMessage(tres.user, `${symbol} @ ${price[symbol]}`)
            treshold[symbol].splice(index, 1);

            await updateTreshold(treshold)
          }
        }
      }
    }
  })
}

const addSymbol = async (ctx) => {
  let msg = ctx.update.message
  let cmd = msg.text.split(' ')
  let sym = cmd[0].toUpperCase()+'USDT'
  let opr = cmd[1]
  let prc = parseInt(cmd[2])

  let treshold = await getTreshold()

  if (treshold[sym] == undefined) treshold[sym] = []
  treshold[sym].push({prc, opr, user:msg.chat.id})

  await updateTreshold(treshold)
  console.log(treshold)
}

module.exports = {
  main: (bot) => {
    bot.on('text', async (ctx) => addSymbol(ctx))
    onMessage(bot);
  }
}
