const record = require('node-record-lpcm16')
const clc = require('cli-color')
const exec = require('child_process').exec


const ai = module.exports = {}

const config = {
  hotword: 'korben',      // hotword (filename & text)
  voice: 'Thomas'         // osx say "text" -v Thomas,Amelie
}


// general debug state
ai.debug = false

// ai config params
ai.config = config

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
  exec(`say "${text}" -v ${ai.config.voice}`, (err, stdout, stderr) => {
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
  ai.say.user(text, ai.debug ? '':'m')


  
}



// play a wav sound
ai.sound = (name) => {
  exec(`afplay hotwords/${name}.wav`)
}


// debug output
ai.log = (text, data) => {
  if(ai.debug)
    process.stdout.write([
      '\n',
      clc.blackBright(`DEBUG : ${text}`),
      data ? '\n'+clc.blackBright(`DATA : ${JSON.stringify(data)}`) : '',
    ].join(''))
}