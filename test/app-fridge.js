
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
let cid = -1

const debug = (err, cmd)=>{
  console.log(err, cmd)
}

describe('fridge app', function() {

  before((next) => {
    ai.init({ env: 'test' }, () => {
      ai.apps.list = []
      next()
    })
  })

  it('load app', function() {
    assert(ai.config.env, 'test')
    ai.apps.add('fridge')
    assert.lengthOf(ai.apps.list, 1)
  })

  it('bla bla bla', (next)=>{ 
    ai.process('bla bla bla', true, (err, cmd)=>{
      should.exist(err)
      should.not.exist(cmd)
      next()
    })
  })


  // Test command in order prior to their position in bundle.cmds

  
  it('Add an item to list', (next)=>{ cid++
    ai.process('tu peux ajouter du lait de coco a la liste de course', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.intent.p1, 'lait de coco')
      next()
    })
  })


})