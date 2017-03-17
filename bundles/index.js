let ai = require('../lib/ai')// dont require('ai') before the init call
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
    ai.debug(`${bundle.name} bundle (${bundle.cmds.length} commands)`)
    ai.debug(`------------`)
    for (const c in bundle.cmds) {
      const cmd = bundle.cmds[c]
      ai.debug(`${b}/${c}: ${cmd.r}  |  ${cmd.d}`)
    }
  }
}

// dryRun don't execute found command (used in test)
//
bm.process = (speech, dryRun, callback = ()=>{}) => {
  if(typeof dryRun == 'function'){
    callback = dryRun
    dryRun = false
  }

  const finalCallback = () => {
    callback()
    ai.debug(`--------------------- end --`)
  }

  const text = utils.nospecials(utils.latin(speech))
  let command
 
  ai.debug(`-- start -------------------`)
  ai.debug(`speech: "${text}"`)

  // loop throught bundles list
  loop1:
    for (const b in bm.list) {
      const bundle = bm.list[b]

  // loop throught bundle command
  loop2:
      for (const c in bundle.cmds) {
        const cmd = bundle.cmds[c]
        const match = text.match(cmd.r)

        // it's a match
        if(match){

          // ai.debug(`bundle: ${bundle.name}, scan ${b}/${c}`)
          ai.debug(`cmd: ${bundle.name} ${b}/${c}`)
          ai.debug(`desc: ${cmd.d}`)

          // attach context to command
          cmd.ctx = { args: match, speech, text }
          cmd.bid = parseInt(b) // bundle id
          cmd.cid = parseInt(c) // command id
          // trigger command (*this* inside the function refer to fully loaded cmd)
          // we just inject *args* for convinience
          //cmd.t(cmd.ctx.args, ai, )
          // hydrate command so we can return it later
          command = cmd

          // exit process loop
          break loop1
        }
      }
    }


  // if command found
  if(command){
    dryRun
      ? finalCallback(null, command)
      : command.t(command.ctx.args, ai, finalCallback)
  }else{
    const e = `command "${text}" not found`
    ai.debug(e)
    finalCallback(e)
  }
}
