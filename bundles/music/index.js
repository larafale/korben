
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}

// use https://github.com/hnarayanan/shpotify
// install: brew install shpotify



const debug = (ctx) => {
  console.log(ctx)
}

bundle.name = 'music'

bundle.cmds = [

  { d: 'Play where last left off',
    r: /(jou|envoi|met|mai|etein).* (son$|musique$)/, t: function(args, ai, cb){
      utils.exec(`spotify play`)
      cb(null, this)
  }},

  { d: 'Finds a song and plays it',
    r: /(jou|met|mai).*(moi|du) (.+)/, t: function(args, ai, cb){
      const song = args[3]
      utils.exec(`spotify play "${song}"`, (err, stdout, stdin) => {
        const e = /no results/gi.test(stdout) && `no music found for "${song}"`
        ai.debug(e || `play song: ${song}`)
        cb(e, this)
      })
  }},

  { d: 'Stop playback',
    r: /(stop|arrete|coupe).*(son|musique)/, t: function(args, ai, cb){
      utils.exec(`spotify pause`)
      cb()
  }},

  { d: 'Play next song',
    r: /(jou|envoi|met|mai).*(son|musique).*(apres|suivant)/, t: function(args, ai, cb){
      utils.exec(`spotify play && spotify next`)
      cb()
  }},

  { d: 'Play previous song',
    r: /(jou|envoi|met|mai).*(son|musique).*(avan|precedent)/, t: function(args, ai, cb){
      utils.exec(`spotify play && spotify prev`)
      cb()
  }},

  { d: 'Adjust volume',
    r: /(diminu|baisse|augmente|met|mai).*(son|musique|volume)[^\d]*(\d{1,3})?.*/, t: function(args, ai, cb){
      let volume = args[3] || ((/(diminu|baisse)/.test(args[1])) ? 'down' : 'up')
      ai.debug(`volume: ${volume}`)
      utils.exec(`spotify vol ${volume}`)
      cb()
  }},


]
  
