const utils = require('../utils')
const bundles = utils.dirs(__dirname)

// bundle manager
const bm =  module.exports = {}


// active list of bundles
bm.list = []

// add a bundle
bm.add = (name) => {
  bm.list.push(require(__dirname+'/'+name))
}

bundles.forEach((name, i) => {
  console.log('adding bundle', name)
  bm.add(name)
})