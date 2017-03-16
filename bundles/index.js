let ai // dont require('ai') before the init call
const utils = require('../utils')
const bundles = utils.dirs(__dirname)


// bundle manager
const bm =  module.exports = {}


bm.init = () => {
  // hydrate ai to context
  ai = require('../lib/ai')

  bundles.forEach((name, i) => {
    bm.add(name)
  })
}

// active list of bundles
bm.list = []

// add a bundle
bm.add = (name) => {
  const bundle = require(__dirname+'/'+name)
  ai.debug(`adding bundle "${name}"`)
  bm.list.push(bundle)
}


bm.debug = () => {
  for (const b in bm.list) {
    const bundle = bm.list[b]
    ai.debug(`------------------`)
    ai.debug(`bundle: ${bundle.name}`)
    for (const c in bundle.cmds) {
      const cmd = bundle.cmds[c]
      ai.debug(`${b}/${c}: ${cmd.r}`)
    }
  }
}

bm.process = (text) => {

  const cleanText = utils.nospecials(utils.latin(text))

  // loop throught bundles list
  loop1:
    for (const b in bm.list) {
      const bundle = bm.list[b]

  // loop throught bundle command
  loop2:
      for (const c in bundle.cmds) {
        const cmd = bundle.cmds[c]

        // it's a match
        if(cmd.r.test(cleanText)){

          ai.debug(`------------------`)
          ai.debug(`bundle: ${bundle.name}, scan ${b}/${c}`)

          // trigger command
          cmd.t(cmd, ai, cleanText)

          // exit process loop
          break loop1
        }
      }
    }
    
  ai.debug(`------------------`)

}
