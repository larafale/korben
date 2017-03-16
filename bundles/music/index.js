
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}



bundle.name = 'music'

bundle.cmds = [

  { r: /(jou|envoi|met).*(son|musique)/, t: (ai) => {
    utils.exec(`spotify play`)
  }},

  { r: /(stop|arrete|coupe).*(son|musique)/, t: (ai) => {
    utils.exec(`spotify pause`)
  }},


]
  
