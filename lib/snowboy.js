
let ai // dont require('ai') before the init call
const { Detector, Models } = require('snowboy')
const utils = require('../utils')

// snowboy manager
const sb = module.exports = {}

let models = new Models()
let detector = {}


module.exports.init = (options = {}) => {
  // hydrate ai to context
  ai = require('./ai')

  let { config, mic } = ai
  let noop = function(){}

  models.add({
    file: __dirname+`/../hotwords/${config.hotword}.pmdl`,
    sensitivity: config.sensitivity || '0.5',
    audioGain: 1,
    hotwords: config.hotword
  })

  detector = new Detector({
    resource: __dirname+'/../node_modules/snowboy/resources/common.res',
    models: models,
    audioGain: 1.0
  })

  detector
    .on('silence', options.silence || noop)
    .on('sound', options.sound || noop)
    .on('error', options.error || noop)
    .on('hotword', options.hotword || function(i, hotword){
      console.log('hotword :', hotword)
    })

  mic.pipe(detector)

}
