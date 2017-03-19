
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
let cid = -1

const debug = (err, cmd)=>{
  console.log(err, cmd)
}


describe('fridge bundle', function() {

  before((next) => {
    ai.init({ env: 'test' }, () => {
      ai.bm.list = []
      next()
    })
  })

  it('load bundle', function() {
    assert(ai.config.env, 'test')
    ai.bm.add('fridge')
    assert.lengthOf(ai.bm.list, 1)
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
    ai.process('tu peux ajouter du lait de coco à la liste de course', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[3], 'lait de coco')
      next()
    })
  })


})