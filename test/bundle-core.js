
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
let cid = -1


describe('core bundle', ()=>{

  before((next) => {
    ai.init({ env: 'test' }, () => {
      ai.bm.list = []
      next()
    })
  })

  it('load bundle', function() {
    assert(ai.config.env, 'test')
    ai.bm.add('core')
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

  it('Quit A.I', (next)=>{ cid++
    ai.process('eteins toi', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Close STT process', (next)=>{ cid++
    ai.process('annule', true, (err, cmd)=>{
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
    ai.process('donne moi les commandes', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Return current time', (next)=>{ cid++
    ai.process('il est quelle heure mec', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

})