const fs = require('fs')
const path = require('path')


module.exports.dirs = (srcpath) => {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}