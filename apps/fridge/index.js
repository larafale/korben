// author: @larafale

const utils = require('../../utils')
const apps = require('../../lib/apps')


const app = module.exports = { 
  name: 'fridge',
  cmds: [],
  ctx: {}
}

app.init = (cb) => {}
app.add = apps.createCommand(app)



app.add('Add an item to list',
  /ajoute/, 
  /.*/, 
  /(liste|ligne|panier)/,
  (cmd, intent, ai, cb) => {
    cmd.append(`list.txt`, '\r\n'+intent.p1, (err) => {
      ai.say.bot(`ok ${item}`)
      cb(null, cmd)
    })
  })
