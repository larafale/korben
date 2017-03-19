let ai // ai is injected on init()
const { Detector, Models } = require('snowboy')
const utils = require('../utils')
const Emitter = require('component-emitter')


// snowboy manager
const sb = module.exports = {
  config: {
    word: [],
    sensitivity: '0.5',
  }
}

// add event pattern
Emitter(sb)

let models = new Models()
let detector


module.exports.init = (ai_, options = {}) => {
  // reference ai
  ai = ai_
  // merge config
  sb.config = utils.merge(sb.config, options)

  console.log(sb.config)

  // create new model
  sb.config.word.forEach((w) => {
    // create new model
    models.add({
      file: __dirname+`/../hotwords/${w}.pmdl`,
      sensitivity: sb.config.sensitivity || '0.5',
      audioGain: 1,
      hotwords: w
    })
  })

  // create detector
  detector = new Detector({
    resource: __dirname+'/../node_modules/snowboy/resources/common.res',
    models: models,
    audioGain: 1.0
  })

  const emit = (evt) => {
    return (a, b)=>sb.emit(evt, a, b)
  }

  detector
    .on('silence', emit('silence'))
    .on('sound', emit('sound'))
    .on('error', emit('error'))
    .on('hotword', emit('hotword'))
}


module.exports.start = () => {
  // pipe microphonne stream to detector
  ai.mic.pipe(detector)
}


module.exports.close = () => {
  ai.mic.unpipe(detector)
}
