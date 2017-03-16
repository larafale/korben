
const ai = require('./ai')
const speech = require('@google-cloud/speech')()

let stream = false
let defaultOptions = {
  singleUtterance: true,
  interimResults: false,
  config: {
    encoding: 'LINEAR16',
    sampleRate: 16000,
    languageCode: 'fr-FR'
  }
}

const enter = () => {
  ai.online = true
  ai.log('stt enter')
}

const exit = module.exports.exit = () => {
  ai.mic.unpipe(stream)       // unpipe microphone
  stream.destroy()            // end stream
  ai.online = false           // resume to offline
  ai.log('stt exiting ...')
}

module.exports.start = (options) => {

  options = Object.assign(defaultOptions, options)
  stream = speech.createRecognizeStream(options)
  enter()

  stream
    .on('close', err => { 
      ai.log('stt closed', err) 
      ai.sound('dong')
    })
    .on('error', err => {
      ai.log('stt error', err)
      exit()
    })

    .on('data', data => {
      if(data.error){
        ai.log('stt data error', data.error)
        return exit()
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
          exit()
          break
      }
    })

  // inject microphone audio to stream
  ai.mic.pipe(stream)

}



