
const assert = require('chai').assert
const should = require('chai').should()
const bm = require('../bundles')
let cid = -1


describe('core bundle', ()=>{

  before(()=>{
    bm.list = [] // reset bundles
  })

  it('load bundle', ()=>{
    bm.add('core')
    assert.lengthOf(bm.list, 1)
  })

  it('bla bla bla', (next)=>{ 
    bm.process('bla bla bla', true, (err, cmd)=>{
      should.exist(err)
      should.not.exist(cmd)
      next()
    })
  })

  // Test command in order prior to their position in bundle.cmds

  it('Quit A.I', (next)=>{ cid++
    bm.process('eteins toi', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Close STT process', (next)=>{ cid++
    bm.process('annule', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Show A.I current config', (next)=>{ cid++
    bm.process('affiche la config', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Show A.I all commands', (next)=>{ cid++
    bm.process('donne moi les commandes', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Return current time', (next)=>{ cid++
    bm.process('il est quelle heure mec', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

})