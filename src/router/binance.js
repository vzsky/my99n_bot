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

const useWebsocket = (bot) => {
  let conn = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr")
  conn.on('error', async (data) => {
    console.log(data);
  });
  conn.on('message', async (data) => {
    let d = JSON.parse(data)
    for (let symbol of d) {
      price[symbol.s] = parseFloat(symbol.c)
    }

    let treshold = await getTreshold()

    for (let symbol in treshold) {
      for (let index in treshold[symbol]) {
        let tres = treshold[symbol][index]
        if (tres.opr[0] == '<') {
          if (price[symbol] < tres.prc) {
            let displayPrice = parseFloat(price[symbol])
            if (tres.opr[1] == 'b') displayPrice = displayPrice*getBathPerDollar() + " THB"
            bot.telegram.sendMessage(tres.user, `${symbol} @ ${displayPrice}`)
            treshold[symbol].splice(index, 1);

            await updateTreshold(treshold)
          }
        }
        if (tres.opr[0] == '>') {
          if (price[symbol] > tres.prc) {
            let displayPrice = parseFloat(price[symbol])
            if (tres.opr[1] == 'b') displayPrice = displayPrice*getBathPerDollar() + " THB"
            bot.telegram.sendMessage(tres.user, `${symbol} @ ${displayPrice}`)
            treshold[symbol].splice(index, 1);

            await updateTreshold(treshold)
          }
        }
      }
    }
  })
  conn.on('close', () => {
    setTimeout(function(){useWebsocket(bot)}, 10000);
  })
}

const verifyTreshold = (symbol, newTreshold) => {
  console.log("testing ", symbol)
  let {prc, opr, user} = newTreshold
  if (prc == NaN || prc == null || opr == null || opr == NaN) return false;
  let flag = false;
  for (let s in price) {
    if (symbol == s) flag = true;
  }
  return flag;
}

const getBathPerDollar = () => {
  return 30.0
}

const addSymbol = async (ctx) => {
  let msg = ctx.update.message
  let cmd = msg.text.split(' ')
  let sym = cmd[0].toUpperCase()
  let opr = cmd[1]
  let prc = parseFloat(cmd[2])
  if (cmd[2] != undefined && cmd[2][cmd[2].length - 1].toUpperCase() == 'B') {
    let BathPerDollar = getBathPerDollar()
    prc /= BathPerDollar
    opr += 'b'
  }

  let treshold = await getTreshold()

  let newTreshold = {prc, opr, user:msg.chat.id}

  let added = false
  for (let suffix of ['', 'USDT', 'BUSD']) {
    let pair = sym+suffix
    if (verifyTreshold(pair, newTreshold)) {
      if (treshold[pair] == undefined) treshold[pair] = []
      treshold[pair].push(newTreshold)
      added = true;
      break;
    }
  }
  if (!added) {
    ctx.reply("I don't Understand", { parse_mode: 'Markdown' })
  }

  await updateTreshold(treshold)
  console.log(treshold)
}

module.exports = {
  main: (bot) => {
    useWebsocket(bot)
    bot.on('text', async (ctx) => addSymbol(ctx))
  }
}
