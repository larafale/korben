const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const clc = require('cli-color')
const exec = require('child_process').exec

const utils = module.exports = {}

// exec command
utils.exec = exec

// notifier
utils.notify = (message, options = {}) => {
  const n = require('node-notifier')
  n.notify(utils.merge({
    title: 'Korben',
    message
  }, options))
} 
  
// say something
utils.say = (text) => {
  if(typeof text != 'string') return
  utils.exec(`say "${text}" -v Alex`)
}

// detect string language
// lang('bonjour') => fra
utils.lang = require('franc-min')
utils.isLang = (lang, samples = []) => {
  return _.some(samples, (s)=>utils.lang(s) == lang)
}

// deep merge objects
utils.merge = require('deepmerge')

// date module
utils.dateFormat = require('./date')

// only latin (no accent)
utils.latin = require('./latin')

// replace special chars with space
utils.nospecials = (text) => {
  return text.replace(/[^a-zA-Z0-9]/g, ' ')
}

utils.debug = (text, data) => {
  process.stdout.write([
    '\n',
    clc.blackBright(`DEBUG : ${text}`),
    data ? '\n'+clc.blackBright(`DATA : ${JSON.stringify(data, null, 2)}`) : '',
  ].join(''))
}


utils.dirs = (srcpath) => {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}
