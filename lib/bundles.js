let ai // ai is injected on init()
const utils = require('../utils')
const bundles = utils.dirs(__dirname+'/../bundles')


// bundle manager
const bm =  module.exports = {
  config: {},
  list: [] // loaded list of bundles
}


bm.init = (ai_, options = {}) => {
  // reference ai
  ai = ai_
  // merge config
  bm.config = utils.merge(bm.config, options)

  bundles.forEach((name, i) => {
    bm.add(name)
  })
}

// add a bundle
bm.add = (name) => {
  const bundle = require('../bundles/'+name)
  ai.debug(`adding bundle "${name}"`)

  // init bundle
  bundle.init && bundle.init()
  // add to list
  bm.list.push(bundle)
}

// debug command
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

// process speech
bm.process = (speech, dryRun, callback = ()=>{}) => {
  if(typeof dryRun == 'function'){
    callback = dryRun
    dryRun = false
  }

  const finalCallback = (err, cmd) => {
    if(err) ai.debug(`err: ${err}`)
    callback(err, cmd)
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

          // enhance cmd
          cmd.write = (file, data, cb) => {
            ai.db.write(file, data, {
              subpath: `/${bundle.name}`
            }, cb)
          }

          cmd.append = (file, data, cb) => {
            ai.db.write(file, data, {
              flag: 'a',
              subpath: `/${bundle.name}`
            }, cb)
          }

          // assign command
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
      // trigger real command (*this* inside the function refer to fully loaded cmd)
      // we  inject *ctx.args* for convinience
      : command.t(command, command.ctx.args, ai, finalCallback)
  }else{
    finalCallback(`command not found`)
  }
}
