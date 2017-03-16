let ai // dont require('ai') before the init call
const speech = require('@google-cloud/speech')()
const utils = require('../utils')

// google speech manager
const gsm = module.exports = {}
const defaultOptions = {
  timeout: 10000,
  lang: 'fr-FR'
}

let stream = false
let timeout = false


const close = gsm.close = () => {
  clearTimeout(timeout)       // clear timeout
  ai.mic.unpipe(stream)       // unpipe microphone
  stream.destroy()            // end stream
  ai.online = false           // resume to offline
  // ai.debug('stt exiting ...')
}


gsm.init = (options = {}) => {
  // hydrate ai to context
  ai = require('./ai')

  // set config
  gsm.config = utils.merge(defaultOptions, options)
}

gsm.start = (options = {}) => {

  options = utils.merge({
    singleUtterance: true,
    interimResults: false,
    config: {
      encoding: 'LINEAR16',
      sampleRate: 16000,
      languageCode: gsm.config.lang
    }
  }, options)

  // create google stream
  stream = speech.createRecognizeStream(options)

  // create timeout
  timeout = setTimeout(close, gsm.config.timeout)

  // set ai as online
  ai.online = true
  ai.debug('stt start')

  stream
    .on('close', err => { 
      ai.debug('stt closed', err) 
      ai.sound('dong')
    })
    .on('error', err => {
      ai.debug('stt error', err)
      close()
    })

    .on('data', data => {
      if(data.error){
        ai.debug('stt data error', data.error)
        return close()
      }

      // transcription
      let text = data.results
      // if(text) ai.say.user(text, ai.debug ? '':'m')
      if(text) ai.process(text)
      // let text = data.results[0] && data.results[0].transcript

      switch(data.endpointerType){
        case 'START_OF_SPEECH': break
        case 'END_OF_UTTERANCE': break
        case 'END_OF_AUDIO': break
        case 'ENDPOINTER_EVENT_UNSPECIFIED':
          close()
          break
      }
    })

  // inject microphone audio to stream
  ai.mic.pipe(stream)

}



