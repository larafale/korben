// author: @larafale
// this module let you control music flow
// it controls the command https://github.com/hnarayanan/shpotify 
// install with: brew install shpotify


const utils = require('../../utils')
const gspeech = require('../../lib/gspeech')
const apps = require('../../lib/apps')


const app = module.exports = { 
  name: 'music',
  cmds: [],
  ctx: {
    playing: false,
    info:  {
      artist: '',
      album: '',
      track: ''
    }
  }
}


app.init = (cb) => {
  getStatus() // get current music info
}

app.add = apps.createCommand(app)


// shorthand
const ctx = app.ctx


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






app.add('Play where last left off',
  /(envoi|met)/, 
  /(son|musique)$/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify play`, (err, stdout, stdin) => {
      getStatus((ctx) => {
        if(!ctx.playing) return cb(`can't resume song`, cmd)
        debugInfo(ai)
        cb(null, cmd)
      })
    })
  })

app.add('Stop playback',
  /(stop|arrete|coupe|etein)/, 
  /(son|musique)/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify pause`)
    cb(null, cmd)
  })

app.add('Play next song',
  /(envoi|met)/, 
  /(son|musique|titre).*(apres|suivant)/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify next`, (err, stdout, stdin) => {
      getStatus((ctx) => {
        if(!ctx.playing) return cb(`can't find next song`, cmd)
        debugInfo(ai)
        cb(null, cmd)
      })
    })
  })

app.add('Play previous song',
  /(envoi|met)/, 
  /(son|musique|titre).*(avan|precedent)/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify prev`, (err, stdout, stdin) => {
      getStatus((ctx) => {
        if(!ctx.playing) return cb(`can't find previous song`, cmd)
        debugInfo(ai)
        cb(null, cmd)
      })
    })
  })

app.add('Music Info',
  /(donne|dire)/, 
  /(son|musique|titre)/,
  (cmd, intent, ai, cb) => {
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
  })

app.add('Finds a song and plays it',
  /joue/, 
  /.*/,
  /.*/,
  (cmd, intent, ai, cb) => {
    const track = intent.p1
    const artist = intent.p2
    const song = `${artist} ${track}`
    utils.exec(`spotify play "${song}"`, (err, stdout, stdin) => {
      const e = err || (/no results/gi.test(stdout) && `no music found for "${song}"`)
      if(e) return cb(e, cmd)
      getStatus((ctx) => {
        debugInfo(ai)
        cb(null, cmd)
      })
    })
  })

app.add('Finds an artist and plays it',
  /joue/, 
  /.*/,
  (cmd, intent, ai, cb) => {
    const song = intent.p1
    utils.exec(`spotify play artist "${song}"`, (err, stdout, stdin) => {
      const e = err || (/no results/gi.test(stdout) && `no music found for "${song}"`)
      if(e) return cb(e, cmd)
      getStatus((ctx) => {
        debugInfo(ai)
        cb(null, cmd)
      })
    })
  })

app.add('Adjust volume',
  /(baisse|diminu|augmente)/, 
  /(son|volume)/,
  (cmd, intent, ai, cb) => {
    let vol = /augmente/.test(intent.action) ? 'up' : 'down'
    utils.exec(`spotify vol ${vol}`)
    ai.debug(`volume: ${vol}`)
    cb(null, cmd)
  })

app.add('Set volume',
  /(baisse|diminu|augmente|met)/, 
  /volume/,
  /(\d{1,3})/,
  (cmd, intent, ai, cb) => {
    let vol = intent.p2.match(cmd.p2)[0]
    utils.exec(`spotify vol ${vol}`)
    ai.debug(`volume: ${vol}`)
    cb(null, cmd)
  })


  
