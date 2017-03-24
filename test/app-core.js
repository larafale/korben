
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
let cid = -1

const debug = (err, cmd)=>{
  console.log(err, cmd)
}

describe('core app', ()=>{

  before((next) => {
    ai.init({ env: 'test' }, () => {
      ai.apps.list = []
      next()
    })
  })

  it('load app', function() {
    assert(ai.config.env, 'test')
    ai.apps.add('core')
    assert.lengthOf(ai.apps.list, 1)
  })

  it('bla bla bla', (next)=>{ 
    ai.process('bla bla bla', true, (err, cmd)=>{
      should.exist(err)
      should.exist(cmd.err)
      next()
    })
  })

  // Test command in order prior to their position in app.cmds

  it('Quit A.I', (next)=>{ cid++
    ai.process('quit le program', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Close STT process', (next)=>{ cid++
    ai.process('annule la commande', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Show A.I current config', (next)=>{ cid++
    ai.process('affiche la config', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Show A.I all commands', (next)=>{ cid++
    ai.process('affiche moi les commandes', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Return current time', (next)=>{ cid++
    ai.process('tu peux me donner l heure', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

})