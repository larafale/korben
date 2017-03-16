
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}

const gspeech = require('../../lib/gspeech')

bundle.name = 'core'

bundle.cmds = [

  { r: /(^ca va|tu vas bien)/, t: (cmd, ai) => {
    ai.say.bot('ca roule')
  }},

  // quit program
  { r: /^eteins toi/, t: (cmd, ai) => {
    ai.say.bot('au revoir')
    utils.exec(`kill ${process.pid}`)
  }},

  // close stt process
  { r: /(annule|kit)/, t: (cmd, ai) => {
    gspeech.close()
    ai.say.bot('ok')
  }},

  // show config
  { r: /(donne|affiche).*config/, t: (cmd, ai) => {
    ai.debug('current config', ai.config)
  }},

  // show command
  { r: /(donne|affiche).*commande/, t: (cmd, ai) => {
    bundles.debug()
  }},

  // what time is it
  { r: /quelle heure/, t: (cmd, ai) => {
    const time = utils.dateFormat('HH:MM')
    ai.say.bot(`il est ${time}`)
  }},

]
  
