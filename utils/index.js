const fs = require('fs')
const path = require('path')
const clc = require('cli-color')
const exec = require('child_process').exec

// exec command
module.exports.exec = exec

// deep merge objects
module.exports.merge = require('deepmerge')

// date module
module.exports.dateFormat = require('./date')

// only latin (no accent)
module.exports.latin = require('./latin')

// replace special chars with space
module.exports.nospecials = (text) => {
  return text.replace(/[^a-zA-Z0-9]/g, ' ')
}

module.exports.debug = (text, data) => {
  process.stdout.write([
    '\n',
    clc.blackBright(`DEBUG : ${text}`),
    data ? '\n'+clc.blackBright(`DATA : ${JSON.stringify(data, null, 2)}`) : '',
  ].join(''))
}


module.exports.dirs = (srcpath) => {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}
