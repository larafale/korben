// author: @larafale

const utils = require('../../utils')
const apps = require('../../lib/apps')
const tv = require('./tv')

const app = module.exports =  apps.create('tv')

// default context
const ctx = app.ctx = {}


app.add('Turn on TV',
  /allume/, 
  /tele/, 
  (cmd, intent, ai, cb) => {
    tv.trigger('power')
    cb(null, cmd, `ok`)
  })

app.add('Turn off TV',
  /etein|coupe/, 
  /tele/, 
  (cmd, intent, ai, cb) => {
    tv.trigger('power')
    cb(null, cmd, `ok`)
  })

app.add('Change channel',
  /zap|met|mai/, 
  /.*/, 
  (cmd, intent, ai, cb) => {
    const channel = tv.getChannel(intent.p1)
    tv.changeChannel(channel)
    cb(null, cmd, channel)
  })


