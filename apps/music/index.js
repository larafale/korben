// author: @larafale
// this module let you control music flow
// it controls the command https://github.com/hnarayanan/shpotify 
// install with: brew install shpotify

const utils = require('../../utils')
const gspeech = require('../../lib/gspeech')
const apps = require('../../lib/apps')

const app = module.exports = apps.create('music')

// default context
const ctx = app.ctx = {
  playing: false,
  info:  {
    artist: '',
    album: '',
    track: ''
  }
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
      cb(ctx)
    })
  }, 0)
}



app.init = (cb) => {
  getStatus() // get current music info
}



app.add('Play where last left off',
  /(envo|met)/, 
  /(son|musique)$/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify play`, (err, stdout, stdin) => {
      getStatus((ctx) => {
        if(!ctx.playing) return cb(`can't resume song`, cmd)
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
  /(joue|envo|met)/, 
  /(son|musique|titre).*(apres|suivant)/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify next`, (err, stdout, stdin) => {
      getStatus((ctx) => {
        if(!ctx.playing) return cb(`can't find next song`, cmd)
        cb(null, cmd, ctx.info)
      })
    })
  })

app.add('Play previous song',
  /(joue|envo|met)/, 
  /(son|musique|titre).*(avant|precedent)/,
  (cmd, intent, ai, cb) => {
    utils.exec(`spotify prev`, (err, stdout, stdin) => {
      getStatus((ctx) => {
        if(!ctx.playing) return cb(`can't find previous song`, cmd)
        cb(null, cmd, ctx.info)
      })
    })
  })

app.add('Music Info',
  /(donne|dire)/, 
  /(chanson|musique|titre)/,
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

      cb(null, cmd, ctx.info)
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
      if(err || /no results/gi.test(stdout)) 
        return cb(`no music found for "${song}"`, cmd)
      getStatus((ctx) => cb(null, cmd, ctx.info))
    })
  })

app.add('Finds an artist and plays it',
  /joue/, 
  /.*/,
  (cmd, intent, ai, cb) => {
    const artist = intent.p1

    // first find artist, then fallback to song
    utils.exec(`spotify play artist "${artist}"`, (err, stdout, stdin) => {
      if(err || /no results/gi.test(stdout)) 
        return utils.exec(`spotify play "${artist}"`, (err, stdout, stdin) => {
          if(err || /no results/gi.test(stdout)) 
            return cb(`no music found for "${artist}"`, cmd)
          getStatus((ctx) => cb(null, cmd, ctx.info))
        })
      
      getStatus((ctx) => cb(null, cmd, ctx.info))
    })
  })

app.add('Adjust volume',
  /(baisse|diminu|augmente)/, 
  /(son|volume)/,
  (cmd, intent, ai, cb) => {
    let vol = /augmente/.test(intent.action) ? 'up' : 'down'
    utils.exec(`spotify vol ${vol}`)
    cb(null, cmd)
  })

app.add('Set volume',
  /(baisse|diminu|augmente|met)/, 
  /volume/,
  /(\d{1,3})/,
  (cmd, intent, ai, cb) => {
    let vol = intent.p2.match(cmd.p2)[0]
    utils.exec(`spotify vol ${vol}`)
    cb(null, cmd)
  })


  
