// author: @larafale

const utils = require('../../utils')
const gspeech = require('../../lib/gspeech')
const apps = require('../../lib/apps')


const app = module.exports = { 
  name: 'core',
  cmds: [],
  ctx: {}
}


app.init = (cb) => {}
app.add = apps.createCommand(app)



app.add('Quit A.I',
  /(quit|etein)/, 
  /program/,
  (cmd, intent, ai, cb) => {
    ai.say.bot('au revoir')
    utils.exec(`kill ${process.pid}`)
    cb(null, cmd)
  })

app.add('Close STT process',
  /annule/, 
  /command/,
  (cmd, intent, ai, cb) => {
    gspeech.close()
    ai.say.bot('ok')
    cb(null, cmd)
  })

app.add('Show A.I current config',
  /affiche/, 
  /config/,
  (cmd, intent, ai, cb) => {
    ai.say.bot(`${utils.pjson(ai.config)}`, 'm')
    cb(null, cmd)
  })

app.add('Show all A.I commands',
  /affiche/, 
  /command/,
  (cmd, intent, ai, cb) => {
    apps.debug()
    cb(null, cmd)
  })

app.add('Return current time',
  /(donne|di\S+)/, 
  'heure',
  (cmd, intent, ai, cb) => {
    const time = utils.dateFormat('HH:MM')
    ai.say.bot(`il est ${time}`)
    cb(null, cmd)
  })


