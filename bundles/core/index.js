
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}

const gspeech = require('../../lib/gspeech')

bundle.name = 'core'

bundle.cmds = [

  { r: /(^ca va|tu vas bien)/, t: (ai) => {
    ai.say.bot('ca roule')
  }},

  // quit program
  { r: /^eteins toi/, t: (ai) => {
    ai.say.bot('au revoir')
    utils.exec(`kill ${process.pid}`)
  }},

  // close stt process
  { r: /(annule|kit)/, t: (ai) => {
    gspeech.close()
    ai.say.bot('ok')
  }},

  // show config
  { r: /(donne|affiche).*config/, t: (ai) => {
    ai.debug('current config', ai.config)
  }},

  // show command
  { r: /(donne|affiche).*commande/, t: (ai) => {
    bundles.debug()
  }},

  // what time is it
  { r: /quelle heure/, t: (ai) => {
    const time = utils.dateFormat('HH:mm')
    ai.say.bot(`il est ${time}`)
  }},

]
  
