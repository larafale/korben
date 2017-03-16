
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}

// use https://github.com/hnarayanan/shpotify
// install: brew install shpotify



bundle.name = 'music'

bundle.cmds = [

  // play current music
  { r: /(jou|envoi|met|mai).* (son|musique)/, t: (cmd, ai, text) => {
    const p = text.match(cmd.r)
    console.log('one', text, p)
    // utils.exec(`spotify play`)
  }},

  // play a given song
  { r: /(jou|met|mai).*moi (.+)/, t: (cmd, ai, text) => {
    const params = text.match(cmd.r)
    const song = params[2]

    ai.debug(`play song: ${song}`)
    utils.exec(`spotify play "${song}"`)
  }},

  { r: /(stop|arrete|coupe).*(son|musique)/, t: (cmd, ai) => {
    utils.exec(`spotify pause`)
  }},


]
  
