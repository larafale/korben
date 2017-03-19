
const splash = require('./utils/splash')
const ai = require('./lib/ai')


ai.init({
  env: 'debug',                   // real|debug|test
  bot: {                          // ai infos
    name: 'korben',               // name
    voice: 'Thomas',              // voice => fr:Thomas,Amelie  en:Alex
  },
  hotword: {                      // hotword config
    word: 'korben',               // word
    sensitivity: '0.4',           // sensitivity
  },
  stt: {                          // speech to text
    lang: 'fr-FR',                // language
    timeout: 5000,               // timeout
  }
}, () => {


  // splash
  if(ai.config.env != 'test') splash()

  // initial dialog
  ai.say.bot('Hello')
  
})




