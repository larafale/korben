
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}

const gspeech = require('../../lib/gspeech')

bundle.name = 'core'

bundle.cmds = [

  { d: 'Quit A.I',
    r: /^eteins toi/, t: function(args, ai, cb){
      ai.say.bot('au revoir')
      utils.exec(`kill ${process.pid}`)
      cb()
  }},

  { d: 'Close STT process',
    r: /^(annule|annuler|kit)$/, t: function(args, ai, cb){
      gspeech.close()
      ai.say.bot('ok')
      cb()
  }},

  { d: 'Show A.I current config',
    r: /(donne|affiche).*config/, t: function(args, ai, cb){
      ai.debug('current config', ai.config)
      cb()
  }},

  { d: 'Show A.I all commands',
    r: /(donne|affiche).*commande/, t: function(args, ai, cb){
      bundles.debug()
      cb()
  }},

  { d: 'Return current time',
    r: /quelle heure/, t: function(args, ai, cb){
      const time = utils.dateFormat('HH:MM')
      ai.say.bot(`il est ${time}`)
      cb()
  }},

]
  
