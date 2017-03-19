// author: larafale
// core module

const utils = require('../../utils')
const bundles = require('../../lib/bundles')


const bundle = module.exports = { 
  name: 'fridge',
  ctx: {}
}


bundle.cmds = [

  { d: 'Add an item to list',
    r: /(ajout|met|mai).*(du |de l |des |la )(.+)\s(dans|a|au)\s?(le|la|)\s(liste|panier)/, t: (cmd, args, ai, cb) => {
      let item = args[3]
      item = item.replace(' d ', ' ').replace(/^l /, ' ') // ex: l'huile d oliv
      item += '\n\r'

      cmd.append(`list.txt`, item, (err) => {
        ai.say.bot(`ok ${args[3]}`)
        cb(null, cmd)
      })

  }}

]

