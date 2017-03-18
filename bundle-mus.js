
const assert = require('chai').assert
const should = require('chai').should()
const bm = require('../bundles')
let cid = -1

const debug = (err, cmd)=>{
  console.log(err, cmd)
}


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
      setTimeout(next, 5000)
      // next()
    })
  })


  // Test command in order prior to their position in bundle.cmds

  
  it('Resumes playback where last left off', (next)=>{ cid++
    bm.process('envoi du son', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
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


  it('Music info', (next)=>{ cid++
    bm.process('c\'est quoi le titre de la chanson', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Finds an artist and plays it', (next)=>{ cid++
    bm.process('met du jack johnson', true, (err, cmd)=>{
      const args = cmd && cmd.ctx.args
      assert.equal(cid, cmd.cid)
      assert.equal(args[3], 'jack johnson')
      next()
    })
  })

  it('Finds a song by name and plays it', (next)=>{ cid++
    bm.process('joue la chanson Adele turning tables', true, (err, cmd)=>{
      const args = cmd && cmd.ctx.args
      assert.equal(cid, cmd.cid)
      assert.equal(args[3], 'Adele turning tables')
      next()
    })
  })

  it('Descrease volume', (next)=>{ cid++
    bm.process('baisse le volume mon gars', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[1], 'baisse')
      should.not.exist(cmd.ctx.args[2])
      next()
    })
  })

  it('Increase volume', (next)=>{
    bm.process('tu peux augmenter le volume mon gars', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[1], 'augmente')
      should.not.exist(cmd.ctx.args[2])
      next()
    })
  })

  it('Custom volume', (next)=>{
    bm.process('met le volume à 25%', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.ctx.args[1], 'met')
      assert.equal(cmd.ctx.args[2], '25')
      next()
    })
  })

})