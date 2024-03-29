
const fs = require('fs')
const mkdirp = require('mkdirp')


const db = module.exports = {
  config: {
    path: '../db',
  }
}


db.init = () => {

}

db.write = (file, data, options = { flag: 'w', subpath: '' }, cb = ()=>{}) => {
  if(typeof options == 'function'){
    cb = options
    options = {}
  }

  const folderpath = `${__dirname}/${db.config.path}${options.subpath}`
  const filepath = `${folderpath}/${file}`

  mkdirp(folderpath, err => {
    if (err) return cb(err)
    fs.writeFile(filepath, data, { flag: options.flag }, cb)
  })
}