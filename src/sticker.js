const { stampMaker, replyer } = require('./utils')
const sticker = stampMaker({
  type: 'sticker',
  deleteWhen: 'sticker',
})

module.exports = {
  stickerSender: (st) => replyer(() => st),
  cherryBounce: sticker(
    'CAACAgIAAxkBAANKXogv4knCS-h3ljVtVbQz5X0iRP8AAgUAA8A2TxP5al-agmtNdRgE'
  ),
  cherryWink: sticker(
    'CAACAgIAAxkBAAIBHl60Xs0IIWBh2NzFEDQdHpwRTRJAAAINAAPANk8TpPnh9NR4jVMZBA'
  ),
  gooseShock: sticker(
    'CAACAgIAAxkBAANAXohGAAFk8OOXNwaDXiiGmHUVpCP7AAJCAANSiZEjg8hUYzO75FkYBA'
  ),
  porgWhat: sticker(
    'CAACAgIAAxkBAAIBF160XddARcYP19bAPSlXyhSg6P8rAAJABQACa8TKCvqec0RBVewxGQQ'
  ),
}
