// author: larafale
// this module let you control music flow
// it controls the command https://github.com/hnarayanan/shpotify 
// install: brew install shpotify

const utils = require('../../utils')
const bundles = require('../../lib/bundles')


const bundle = module.exports = { 
  name: 'music',
  ctx: {
    playing: false,
    info:  {
      artist: '',
      album: '',
      track: ''
    }
  }
}


// shorthand
const ctx = bundle.ctx


const debugInfo = (ai) => {
  ai.debug(`artist: ${ctx.info.artist}`)
  ai.debug(`track: ${ctx.info.track}`)
  ai.debug(`album: ${ctx.info.album}`)
}

const parseMusic = (string) => {
  try {
    return {
      artist: string.match(/artist:\s([^\n]*)/i)[1],
      album: string.match(/album:\s([^\n]*)/i)[1],
      track: string.match(/track:\s([^\n]*)/i)[1]
    }
  } catch (e){ 
    return {}
  }
}

const getStatus = (cb = ()=>{}) => {
  setTimeout(()=>{
    utils.exec(`spotify status`, (err, stdout, stdin) => {
      ctx.playing = !/currently paused/gi.test(stdout) 
      ctx.info = parseMusic(stdout)
      if(ctx.info.artist) utils.notify(`${ctx.info.artist} - ${ctx.info.track}`)
      cb(ctx)
    })
  }, 1000)
}


bundle.init = (cb) => {
  // get current music info
  getStatus()
}


bundle.cmds = [

  { d: 'Play where last left off',
    r: /(jou|envoi|met|mai|etein).* (son$|musique$)/, t: (cmd, args, ai, cb) => {
      utils.exec(`spotify play`, (err, stdout, stdin) => {
        getStatus((ctx) => {
          if(!ctx.playing) return cb(`can't resume song`, cmd)
          debugInfo(ai)
          cb(null, cmd)
        })
      })
  }},

  { d: 'Stop playback',
    r: /(stop|arrete|coupe).*(son|musique)/, t: (cmd, args, ai, cb) => {
      utils.exec(`spotify pause`)
      cb(null, cmd)
  }},

  { d: 'Play next song',
    r: /.*(son|musique|titre).*(apres|suivant)/, t: (cmd, args, ai, cb) => {
      utils.exec(`spotify next`, (err, stdout, stdin) => {
        getStatus((ctx) => {
          if(!ctx.playing) return cb(`can't find next song`, cmd)
          debugInfo(ai)
          cb(null, cmd)
        })
      })
  }},

  { d: 'Play previous song',
    r: /.*(son|musique|titre).*(avan|precedent)/, t: (cmd, args, ai, cb) => {
      utils.exec(`spotify prev`, (err, stdout, stdin) => {
        getStatus((ctx) => {
          if(!ctx.playing) return cb(`can't find previous song`, cmd)
          debugInfo(ai)
          cb(null, cmd)
        })
      })
  }},

  { d: 'Music Info',
    r: /.*quoi.*[nom|titre]?.*[son|musique].*/, t: (cmd, args, ai, cb) => {
      getStatus((ctx) => {
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

        debugInfo(ai)
        cb(null, cmd)
      })
  }},

  { d: 'Finds an artist and plays it',
    r: /(joue|met|mai|envoi).*(moi|nous|du)\s(.+)/, t: (cmd, args, ai, cb) => {
      const song = args[3]
      utils.exec(`spotify play artist "${song}"`, (err, stdout, stdin) => {
        const e = err || (/no results/gi.test(stdout) && `no music found for "${song}"`)
        if(e) return cb(e, cmd)
        getStatus((ctx) => {
          debugInfo(ai)
          cb(null, cmd)
        })
      })
  }},

  { d: 'Finds a song and plays it',
    r: /(jou|met|mai|envoi).*(son|musique)\s(.+)/, t: (cmd, args, ai, cb) => {
      const song = args[3]
      utils.exec(`spotify play "${song}"`, (err, stdout, stdin) => {
        const e = err || (/no results/gi.test(stdout) && `no music found for "${song}"`)
        if(e) return cb(e, cmd)
        getStatus((ctx) => {
          debugInfo(ai)
          cb(null, cmd)
        })
      })
  }},

  { d: 'Adjust volume',
    r: /(diminu|baisse|augmente|met|mai).*(volume)[^\d]*(\d{1,3})*/, t: (cmd, args, ai, cb) => {
      let vol = args[3] || ((/(augmente)/.test(args[1])) ? 'up' : 'down')
      utils.exec(`spotify vol ${vol}`)
      ai.debug(`volume: ${vol}`)
      cb(null, cmd)
  }},


]
  
