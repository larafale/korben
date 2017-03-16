
const ai = require('./lib/ai')
const bundles = require('./bundles')
const snowboy = require('./lib/snowboy')
const gspeech = require('./lib/gspeech')


console.log(bundles)

// initial dialog
ai.say.bot('Hello')
ai.say.user('')



snowboy.config({
  hotword: (index, hotword) => {

    ai.log('hotword detected')
    ai.sound('ding')

    if(ai.online){
      console.log("SNOWBOY - NO GOOGLE")
    } else {
      gspeech.start()
    }
  }
})



