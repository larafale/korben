
const utils = require('../../utils')
const bundles = require('../')
const bundle = module.exports = {}

// use https://github.com/hnarayanan/shpotify
// install: brew install shpotify



const debug = (ctx) => {
  console.log(ctx)
}

const parseInfo = (string) => {
  try {
    return {
      artist: string.match(/artist:\s([^\n]*)/i)[1],
      album: string.match(/album:\s([^\n]*)/i)[1],
      track: string.match(/track:\s([^\n]*)/i)[1]
    }
  }catch (e){
    return {}
  }
}

bundle.name = 'music'

const ctx = bundle.ctx = {
  playing: false,
  info: {}
}

bundle.init = () => {

  utils.exec(`spotify status`, (err, stdout, stdin) => {
    ctx.playing = !/currently paused/gi.test(stdout) 
    ctx.info = !ctx.playing ? {} : parseInfo(stdout)
  })

}

bundle.init()

bundle.cmds = [

  { d: 'Play where last left off',
    r: /(jou|envoi|met|mai|etein).* (son$|musique$)/, t: function(args, ai, cb){
      utils.exec(`spotify play`)
      cb(null, this)
  }},

  { d: 'Finds a song and plays it',
    r: /(jou|met|mai).*(moi|du|moid du) (.+)/, t: function(args, ai, cb){
      const song = args[3]
      utils.exec(`spotify play artist "${song}"`, (err, stdout, stdin) => {
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
    r: /.*(son|musique|titre).*(apres|suivant)/, t: function(args, ai, cb){
      utils.exec(`spotify next`)
      cb()
  }},

  { d: 'Play previous song',
    r: /.*(son|musique|titre).*(avan|precedent)/, t: function(args, ai, cb){
      utils.exec(`spotify prev`)
      cb()
  }},

  { d: 'Adjust volume',
    r: /(diminu|baisse|augmente|met|mai).*(son|musique|volume)[^\d]*(\d{1,3})?.*/, t: function(args, ai, cb){
      let volume = args[3] || ((/(diminu|baisse)/.test(args[1])) ? 'down' : 'up')
      ai.debug(`volume: ${volume}`)
      utils.exec(`spotify vol ${volume}`)
      cb()
  }},

  { d: 'Music Info',
    r: /.*quoi.*[nom|titre]?.*[son|musique].*/, t: function(args, ai, cb){
      let volume = args[3] || ((/(diminu|baisse)/.test(args[1])) ? 'down' : 'up')
      utils.exec(`spotify status`, (err, stdout, stdin) => {

        // no music is playing, return error
        const e = /currently paused/gi.test(stdout) && `no music is playing"`
        if(e) return cb(e)

        // update ctx.info
        ctx.info = parseInfo(stdout)

        // choose the language
        // if it's not french, it will use english voice
        const lang = utils.isLang('fra', [
          ctx.info.album,
          ctx.info.track
        ]) ? 'fr' : 'en'

        const voice = lang == 'fr' ? '-v Thomas' : '-v Alex'
        const link = lang == 'fr' ? 'de' : 'from'

        // speak out loud results 
        utils.exec(`
          say "${ctx.info.track}" ${voice};
          say "${lang=='fr'?'de':'from'} ${ctx.info.artist}" ${voice};
          say "album ${ctx.info.album}" ${voice};
        `)

        ai.debug(`artist: ${ctx.info.artist}`)
        ai.debug(`track: ${ctx.info.track}`)
        ai.debug(`album: ${ctx.info.album}`)
        cb(null, ctx.info)
      })
  }},


]
  
