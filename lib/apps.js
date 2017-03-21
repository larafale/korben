let ai // ai is injected on init()
const utils = require('../utils')
const apps = utils.dirs(__dirname+'/../apps')


// app manager
const am =  module.exports = {
  config: {},
  list: [] // loaded list of apps
}


am.init = (ai_, options = {}) => {
  // reference ai
  ai = ai_
  // merge config
  am.config = utils.merge(am.config, options)

  apps.forEach((name, i) => {
    am.add(name)
  })
}

// add a app
am.add = (name) => {
  const app = require('../apps/'+name)
  ai.debug(`adding app "${name}"`)

  // init app
  app.init && app.init()

  // add to list
  am.list.push(app)
}

// add fx for app to register cmommands
am.createCommand = (app) => {
  return (name, action, p1, p2, fx) => {
    if(typeof p2 == 'function'){
      fx = p2
      p2 = false
    }
    app.cmds.push({ name, action, p1, p2, fx })
  }
}

// debug command
am.showCommands = (printFx) => {

  printFx = printFx || ai.debug

  for (const b in am.list) {
    const app = am.list[b]
    printFx(`------------------`)
    printFx(`${app.name} app (${app.cmds.length} commands)`)
    printFx(`------------`)
    for (const c in app.cmds) {
      const cmd = app.cmds[c]
      printFx(`${b}/${c}:  ${cmd.name}  =>  ${cmd.action} ${cmd.p1} ${cmd.p2?cmd.p2:""}`)
    }
  }
}

// process speech
am.process = (speech, options = {}, callback = ()=>{}) => {
  if(typeof options == 'function'){
    callback = options
    options = {}
  }

  let text = utils.nospecials(utils.latin(speech))
  let app, cmd, intent
  let hasMatched
 
  ai.debug(`-- start -------------------`)
  
  loop1: // loop throught apps list
    for (const b in am.list) {
      app = am.list[b]

  loop2: // loop throught app command
      for (const c in app.cmds) {
        cmd = app.cmds[c]

        if(intent = matchIntent(text, cmd)){

          hasMatched = true

          // ai.debug(`app: ${app.name}, scan ${b}/${c}`)
          ai.debug(`cmd: ${app.name} ${b}/${c} - ${cmd.name}`)
          ai.debug(`action: ${intent.action} ${intent.p1}`)

          // attach context to command
          cmd.options = options
          cmd.intent = intent
          cmd.speech = speech
          cmd.text = text
          cmd.aid = parseInt(b) // app id
          cmd.cid = parseInt(c) // command id

          // console.log(cmd)

          // enhance cmd
          cmd.write = (file, data, cb) => {
            ai.db.write(file, data, {
              subpath: `/${app.name}`
            }, cb)
          }

          cmd.append = (file, data, cb) => {
            ai.db.write(file, data, {
              flag: 'a',
              subpath: `/${app.name}`
            }, cb)
          }

          // exit process loop
          break loop1
        }
      }
    }


  const finalCallback = (err, cmd) => {
    if(err){
      ai.debug(`err: ${err}`)
      ai.sound('error')
    }
    
    ai.debug(`--------------------- end --\n`)
    callback(err, cmd)
  }

  // if command not found
  if(!hasMatched) return finalCallback(`command not found`)

  // trigger sound
  ai.sound('trigger')

  // execute command
  options.dryRun
    ? finalCallback(null, cmd)
    // trigger real command (*this* inside the function refer to fully loaded cmd)
    // we  inject *ctx.args* for convinience
    : cmd.fx(cmd, cmd.intent, ai, finalCallback)

}



// given a text, return false or intent object
function matchIntent(text, cmd) {
  let intent
    
  const parse = (regex, mode) => {
    let match = text.match(regex)
    if(!match) return false

    // hydrate intent
    intent = {
      action: match[4],
      p1: match[8],
      p2: match[12] || false,
    }

    const test = (key) => {
      if(!cmd[key]) return false 
      else if(typeof cmd[key] == 'string') return cmd[key] === intent[key]
      else if(cmd[key] instanceof RegExp) return cmd[key].test(intent[key])
    }

    if(mode == 'one') return test('action') && test('p1')
    if(mode == 'two') return test('action') && test('p1') && test('p2')
  }

  const find = (cmd) => {

    const regexOne = /((je|tu)\s\w+)?\s?(me\s|m\s)?\s?(\w+)(\smoi)?\s?((de\s)?[lud][\saeun]?[se]?\s)?\s?(.+)/i
    const regexTwo = /((je|tu)\s\w+)?\s?(me\s|m\s)?\s?(\w+)(\smoi)?\s?((de\s)?[dlmtu][\saeun]?[ens]?\s)?\s?(.+)\s((au?\s|dans\s|de\s|sur\s|par\s)([adlmtu][aenu]\s|[adlmtu][aenou][ens]\s)?)\s?(.+)/i
    
    if(!!cmd.p1 && !cmd.p2) 
      return parse(regexOne, 'one')
    if(!!cmd.p1 && !!cmd.p2) 
      return parse(regexTwo, 'two')
  }

  return find(cmd) && intent

}
