
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
const tv = require('../apps/tv/tv')
let cid = -1

const debug = (err, cmd)=>{
  console.log(err, cmd)
}

describe('tv app', function() {

  before((next) => {
    ai.init({ env: 'test' }, () => {
      ai.apps.list = []
      next()
    })
  })

  it('load app', function() {
    assert(ai.config.env, 'test')
    ai.apps.add('tv')
    assert.lengthOf(ai.apps.list, 1)
  })

  it('bla bla bla', (next)=>{ 
    ai.process('bla bla bla', true, (err, cmd)=>{
      should.exist(err)
      should.exist(cmd.err)
      next()
    })
  })


  // Test command in order prior to their position in bundle.cmds

  
  it('Turn ON tv', (next)=>{ cid++
    ai.process('allume la tele', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Turn ON tv', (next)=>{ cid++
    ai.process('tu peux eteindre la tele', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Change channel', (next)=>{ cid++
    ai.process('zap sur la 6', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(tv.getChannel(cmd.intent.p1).name, 'M6')
      next()
    })
  })

})