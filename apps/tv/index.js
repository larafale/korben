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
    cb(null, cmd, `ok`)
  })

app.add('Turn off TV',
  /etein|coupe/, 
  /tele/, 
  (cmd, intent, ai, cb) => {
    cb(null, cmd, `ok`)
  })

app.add('Change channel',
  /zap|met/, 
  /.*/, 
  (cmd, intent, ai, cb) => {
    const channel = tv.find(intent.p1)
    cb(null, cmd, channel)
  })


