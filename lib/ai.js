const utils = require('../utils')
const record = require('node-record-lpcm16')
const clc = require('cli-color')
const snowboy = require('./snowboy')
const gspeech = require('./gspeech')
const bundles = require('../bundles')


const ai = module.exports = {}
const defaultOptions = {
  debug: true,
  name: 'korben',         // ai name
  hotword: 'korben',      // hotword (filename & text)
  sensitivity: '0.5',     // hotword sensitivity
  lang: 'fr-FR',          // stt language
  timeout: 10000,         // stt timeout
  voice: 'Thomas',        // fr:Thomas,Amelie  en:Alex
}

ai.config = {}

ai.init = (options, cb = ()=>{}) => {
  
  // ai config params
  ai.config = Object.assign(defaultOptions, options)

  // load bundles
  bundles.init()

  // init snowboy
  snowboy.init({
    hotword: (index, hotword) => {

      ai.debug('hotword detected')

      // if not online start stt
      if(!ai.online){
        gspeech.start()
        ai.sound('ding')
      }else{
        // do nothing
        ai.say.append(' (stt is online)')
      } 
    }
  })

  // init google speech
  gspeech.init({
    lang: ai.config.lang,
    timeout: ai.config.timeout,
  })

  // trigger callback
  cb()
}


// state of privacy
// true when speech is sent to stt service
// reseted to false when stt resume
ai.online = false


// microphone input
ai.mic = record.start({ threshold: 0, /*verbose: true*/ })

// bot information
ai.bot = { 
  name: 'korben', 
  color: clc.magentaBright 
}

// users known to ai
ai.users = [{ 
  name: 'louis', 
  color: clc.cyanBright 
}]

// current user
ai.user = () => {
  return ai.users[0]
}


// text to speech
ai.speak = (text) => {
  utils.exec(`say "${text}" -v ${ai.config.voice}`, (err, stdout, stderr) => {
    // console.log(err, stdout, stderr)
  })
}

// render conversation
// modes: 
//  m: mute 
//  a: append 
ai.say = (user, text, mode = '') => { 

  // no mute
  if(!/m/.test(mode) && text) 
    ai.speak(text)

  // print
  process.stdout.write([
    '\n',
    user.color(user.name), 
    ': ',
    clc.white(text||'')
  ].join(''))
}

ai.say.bot = (text, mode) => ai.say(ai.bot, text, mode)
ai.say.user = (text, mode) => ai.say(ai.user(), text, mode)
ai.say.append = (text) => process.stdout.write(clc.white(text||''))



ai.process = (text) => {
  // echo user speech
  ai.say.user(text, 'm')

  // pass down to bundles
  bundles.process(text)
}



// play a wav sound
ai.sound = (name) => {
  utils.exec(`afplay hotwords/${name}.wav`)
}


// debug output
ai.debug = (text, data) => {
  if(ai.config.debug) utils.debug(text, data)
}