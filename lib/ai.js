const utils = require('../utils')
const microphone = require('node-record-lpcm16')
const clc = require('cli-color')


const ai = module.exports = {

  config: {
    env: 'debug',                   // real|debug|test
    cmd: false,                     // command mode
    bot: {                          // ai infos
      name: 'korben',               // name
      voice: 'Thomas',              // voice => fr:Thomas,Amelie  en:Alex
      color: clc.magentaBright,     // color in terminal
    },
    hotword: {                      // hotword config
      word: [],                     // words
      audioGain: 1,                 // gain
      sensitivity: '0.5',           // sensitivity
    },
    stt: {                          // speech to text
      lang: 'fr-FR',                // language
      timeout: 8000,                // timeout
    },
    enabled: {
      chat: true,
      voice: true,
      server: true
    }
  },

  // state of privacy
  // true when speech is sent to stt service
  // reseted to false when stt resume
  online: false,
  
  // microphone input
  mic: false,

}


const db = ai.db = require('./db')
const snowboy = ai.sb = require('./snowboy')
const gspeech = ai.gsm = require('./gspeech')
const apps = ai.apps = require('./apps')

// users known to ai
ai.users = [{ 
  name: 'louis', 
  color: clc.cyanBright 
}]


ai.init = (options, cb = ()=>{}) => {
  // merge config
  ai.config = utils.merge(ai.config, options)

  // init apps
  apps.init(ai, {})

  // test mode
  if(ai.config.env == 'test') return cb()

  // command mode
  if(ai.config.cmd) return cb()

  // chat mode
  if(ai.config.enabled.chat)
    process.openStdin().addListener("data", d => {
      let speech = d.toString().trim()
      ai.process(speech, { callee: 'chat' })
    })
  
  // voice mode
  if(ai.config.enabled.voice){

    // start mic
    ai.mic = microphone.start({ threshold: 0, /*verbose: true*/ })

    // init snowboy
    snowboy.init(ai, ai.config.hotword)
   
    // configure hotword
    snowboy.on('hotword', (index, hotword) => {
      ai.debug(`hotword ${hotword} detected`)

      // if not online start stt
      if(!ai.online){  
        snowboy.close()
        gspeech.start()
        ai.sound('ding')
      }else{
        // do nothing
        ai.say.append(' (stt is online)')
      } 
    })

    // start hotword
    snowboy.start()

    // init google speech
    gspeech.init(ai, ai.config.stt)

  }
  
  // trigger callback
  cb()

}




// current user
ai.user = () => {
  return ai.users[0]
}


// text to speech
ai.speak = (text, voice) => {
  if(ai.config.env == 'test' || typeof text == 'object') return
  utils.exec(`say "${text}" -v ${voice || ai.config.bot.voice}`, (err, stdout, stderr) => {
    // console.log(err, stdout, stderr)
  })
}

// render conversation
// modes: 
//  m: mute 
ai.say = (user, text, mode = '', voice, linebreak) => {

  // no mute
  if(text && !/m/.test(mode)) 
    ai.speak(text, voice)

  // no print on command mode
  if(ai.config.cmd) return

  // no print on test
  if(ai.config.env != 'test')
    process.stdout.write([
      linebreak ? '\n': '',
      user.color(user.name), 
      ': ',
      clc.white(text||''),
    ].join(''))

  return true
}

ai.say.bot = (text, mode, voice) => ai.say(ai.config.bot, text, mode, voice, true)
ai.say.user = (text, mode, voice, linebreak) => ai.say(ai.user(), text, mode, voice, linebreak)
ai.say.err = (text) => ai.say(ai.bot, text, '', 'Alex')
ai.say.append = (text) => process.stdout.write(clc.white(text||''))


// load a app
ai.load = (name) => {
  apps.load(name)
}

// process a command
// options can be setted to true as a shorthand to set fake=true
ai.process = (text, options = {}, callback = ()=>{}) => {
  if(typeof options == 'function'){
    callback = options
    options = {}
  }

  options = utils.merge({
    fake: options === true,     // fake call
    callee: ''                  // cmd|chat|stt
  }, options || {})

  // echo speech if triggered from stt
  if(options.callee == 'stt'){
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    ai.say.user(text, 'm') // print, mute & linebreak
  }

  // pass down args to apps.process
  apps.process(text, options, (err, cmd) => {
    callback(err, cmd)
    ai.say.user('', false, false, options.callee == 'stt') // give back input    
  })
}



// play a wav sound
ai.sound = (name) => {
  if(ai.config.env != 'test') utils.exec(`afplay sounds/${name}.wav`)
}

// notify output
ai.notify = (text, options) => {
  if(ai.config.env == 'real') utils.notify(text, options)
}

// debug output
ai.debug = (text, data) => {
  if(ai.config.env == 'debug') utils.debug(text, data)
}





