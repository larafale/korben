
const ai = require('./ai')
const { Detector, Models } = require('snowboy')

let models = module.exports.models = new Models()
let detector = module.exports.detector = {}


module.exports.config = (options) => {

  let { config, mic } = ai
  let noop = function(){}

  models.add({
    file: __dirname+`/../hotwords/${config.hotword}.pmdl`,
    sensitivity: '0.5',
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
