const { NovelCovid } = require('novelcovid');
const Comma = require('comma-number')
 
const track = new NovelCovid();

const all = async (ctx) => {
    let res = await track.all()
    ctx.reply(
`*STAY SAFE*
_global covid situation_
Infected : ${Comma(res.cases)}
Response : ${Comma(res.recovered)}
Death : ${Comma(res.deaths)}
Active : ${Comma(res.active)}`
, {parse_mode:'Markdown'})
}

const thai = async (ctx) => {
    let res = await track.countries('thailand')
    ctx.reply(
`*STAY SAFE*
_Thai covid situation_
Infected : ${Comma(res.cases)}
Response : ${Comma(res.recovered)}
Death : ${Comma(res.deaths)}
Active : ${Comma(res.active)}`
, {parse_mode:'Markdown'})
}

module.exports = {
    all : all,
    thai : thai,
}