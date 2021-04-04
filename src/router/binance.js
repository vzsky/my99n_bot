const WebSocket = require('ws')
const { removeAndRun, replyer } = require('../utils')

let price = {}
let treshold = {}

let conn = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr")
conn.on('error', function incoming(data) {
  console.log(data);
});

const onMessage = (bot) => {
  conn.on('message', function incoming(data) {
    let d = JSON.parse(data)
    for (let symbol of d) {
      price[symbol.s] = symbol.c
    }
    for (let symbol in treshold) {
      for (let index in treshold[symbol]) {
        let tres = treshold[symbol][index]
        if (tres.opr == '<') {
          if (price[symbol] < tres.prc) {
            bot.telegram.sendMessage(tres.user, `${symbol} @ ${price[symbol]}`)
            treshold[symbol].splice(index, 1);
          }
        }
        if (tres.opr == '>') {
          if (price[symbol] > tres.prc) {
            bot.telegram.sendMessage(tres.user, `${symbol} @ ${price[symbol]}`)
            treshold[symbol].splice(index, 1);
          }
        }
      }
    }
  })
}

const addSymbol = (ctx) => {
  let msg = ctx.update.message
  let cmd = msg.text.split(' ')
  let sym = cmd[0].toUpperCase()+'USDT'
  let opr = cmd[1]
  let prc = parseInt(cmd[2])
  if (treshold[sym] == undefined) treshold[sym] = []
  treshold[sym].push({prc, opr, user:msg.chat.id})
  console.log(treshold)
}

module.exports = {
  main: (bot) => {
    bot.on('text', async (ctx) => addSymbol(ctx))
    onMessage(bot);
  }
}
