
const assert = require('chai').assert
const should = require('chai').should()
const bm = require('../bundles')
let cid = -1


describe('music bundle', function() {

  before(() => {
    bm.list = [] // reset bundles
  })

  it('load bundle', function() {
    bm.add('music')
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

  
  it('Resumes playback where last left off', (next)=>{ cid++
    bm.process('envoi du son', true, (err, cmd)=>{

      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Finds a song by name and plays it', (next)=>{ cid++
    bm.process('met du jack johnson', true, (err, cmd)=>{
      const args = cmd && cmd.ctx.args
      assert.equal(cid, cmd.cid)
      assert.equal(args[3], 'jack johnson')
      next()
    })
  })

  it('Stop playback', (next)=>{ cid++
    bm.process('coupe la musique', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Play next song', (next)=>{ cid++
    bm.process('envoi la chanson d\'apres', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Play previous song', (next)=>{ cid++
    bm.process('met la musique d\'avant', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Descrease volume', (next)=>{ cid++
    bm.process('baisse le volume mon gars', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[1], 'baisse')
      assert.equal(cmd.ctx.args[2], 'volume')
      should.not.exist(cmd.ctx.args[3])
      next()
    })
  })

  it('Increase volume', (next)=>{
    bm.process('augmente la musique mon pote', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[1], 'augmente')
      assert.equal(cmd.ctx.args[2], 'musique')
      should.not.exist(cmd.ctx.args[3])
      next()
    })
  })

  it('Custom voulume', (next)=>{
    bm.process('met le son à 25% mon gars', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[1], 'met')
      assert.equal(cmd.ctx.args[2], 'son')
      assert.equal(cmd.ctx.args[3], '25')
      next()
    })
  })


})