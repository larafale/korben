let ai // ai is injected on init()
const speech = require('@google-cloud/speech')()
const utils = require('../utils')

// google speech manager
const gsm = module.exports = {
  config: {
    timeout: 10000,
    lang: 'fr-FR'
  }
}

let stream = false
let timeout = false


const close = gsm.close = () => {
  clearTimeout(timeout)       // clear timeout
  ai.mic.unpipe(stream)       // unpipe microphone
  stream.destroy()            // end stream
  ai.online = false           // set ai to offline
  ai.sb.start()               // restart snowboy
  // ai.debug('stt exiting ...')
}


gsm.init = (ai_, options = {}) => {
  // reference ai
  ai = ai_
  // merge config
  gsm.config = utils.merge(gsm.config, options)
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
  timeout = setTimeout(() => {
    ai.sound('timeout')
    close()
  }, gsm.config.timeout)

  ai.online = true // set ai to online
  // ai.debug('stt start')

  stream
    .on('close', err => { 
      // ai.debug('stt closed', err) 
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
      if(text) ai.process(text, { callee: 'stt' })

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



