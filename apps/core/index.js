// author: @larafale

const utils = require('../../utils')
const gspeech = require('../../lib/gspeech')
const apps = require('../../lib/apps')


const app = module.exports = apps.create('core')


app.add('Quit A.I',
  /(quit|etein)/, 
  /program/,
  (cmd, intent, ai, cb) => {
    utils.exec(`kill ${process.pid}`)
    cb(null, cmd, 'au revoir')
  })

app.add('Close STT process',
  /annule/, 
  /command/,
  (cmd, intent, ai, cb) => {
    gspeech.close()
    cb(null, cmd, 'ok')
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
    apps.showCommands((t) => ai.say.bot(t, 'm'))
    cb(null, cmd)
  })

app.add('Return current time',
  /(donne|di\S+)/, 
  'heure',
  (cmd, intent, ai, cb) => {
    const time = utils.dateFormat('HH:MM')
    cb(null, cmd, `il est ${time}`)
  })


