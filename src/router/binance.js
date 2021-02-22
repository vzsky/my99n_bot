const binview = require('binanceview')
const { removeAndRun, stampMaker, replyer } = require('../utils')

const text = stampMaker({ type: 'md', kind: 'fin', deleteWhen: 'binance' })

let symbols = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'ADAUSDT',
  'DOTUSDT',
  'ATOMUSDT',
  'BCHUSDT',
  'XMRUSDT'
]

const checkAllSignal = (ctx) => {
  const reply = replyer(async () => {

    let s = ""
    
    let result = await binview.CheckSymbols(symbols)
    for (let i in symbols) {
      for (let key in result[i]) {
        for (let res of result[i][key]) {
          if (res == '') continue;
          s += `${symbols[i]} [${key}] ${res}\n`
        }
      }
    }

    if (s == "") return text(`No signal found for all listed symbols`)
    return text(s);
  })
  reply(ctx)
}

const main = (ctx) => {
  return checkAllSignal(ctx)
}

module.exports = {
  main: (bot) => {
    bot.command('binance', async (ctx) => removeAndRun(ctx, main))
  }
}
