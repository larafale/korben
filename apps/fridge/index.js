// author: @larafale

const utils = require('../../utils')
const apps = require('../../lib/apps')

const app = module.exports =  apps.create('fridge')



app.add('Add an item to list',
  /ajoute/, 
  /.*/, 
  /(liste|ligne|panier)/,
  (cmd, intent, ai, cb) => {
    cmd.append(`list.txt`, '\r\n'+intent.p1, (err) => {
      cb(null, cmd, `${intent.p1} ajouté !`)
    })
  })

app.add('Get list by email',
  /(envo|donne)/, 
  /liste/,
  (cmd, intent, ai, cb) => {
    const list = `${__dirname}/../../db/fridge/list.txt`
    const email = 'louis.grellet@gmail.com,olivia.leleux@gmail.com'
    utils.exec(`cat ${list} | mail -s "liste de courses" ${email}`, (err, stdout, stdin) => {
      cb(null, cmd, 'ok')
    })
  })