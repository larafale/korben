
const ai = require('./lib/ai')


ai.init({
  debug: true,
  name: 'korben',         // ai name
  hotword: 'korben',      // hotword (filename & text)
  sensitivity: '0.5',     // hotword sensitivity
  lang: 'fr-FR',          // stt language
  timeout: 10000,          // stt timeout
  voice: 'Thomas',        // fr:Thomas,Amelie  en:Alex
}, () => {

  // initial dialog
  ai.say.bot('Hello')
  ai.say.user('')
  
})







