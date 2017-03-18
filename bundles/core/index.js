// author: larafale
// core module

const utils = require('../../utils')
const gspeech = require('../../lib/gspeech')
const bundles = require('../')
const bundle = module.exports = { 
  name: 'core'
}



bundle.cmds = [

  { d: 'Quit A.I',
    r: /^eteins toi/, t: (cmd, args, ai, cb) => {
      ai.say.bot('au revoir')
      utils.exec(`kill ${process.pid}`)
      cb(null, cmd)
  }},

  { d: 'Close STT process',
    r: /^(annule|annuler|kit)$/, t: (cmd, args, ai, cb) => {
      gspeech.close()
      ai.say.bot('ok')
      cb(null, cmd)
  }},

  { d: 'Show A.I current config',
    r: /(donne|affiche).*config/, t: (cmd, args, ai, cb) => {
      ai.debug('current config', ai.config)
      cb(null, cmd)
  }},

  { d: 'Show A.I all commands',
    r: /(donne|affiche).*commande/, t: (cmd, args, ai, cb) => {
      bundles.debug()
      cb(null, cmd)
  }},

  { d: 'Return current time',
    r: /quelle heure/, t: (cmd, args, ai, cb) => {
      const time = utils.dateFormat('HH:MM')
      ai.say.bot(`il est ${time}`)
      cb(null, cmd)
  }},

]
  
