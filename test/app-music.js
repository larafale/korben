
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
let cid = -1

const debug = (err, cmd)=>{
  console.log(err, cmd)
}

describe('music app', function() {

  before((next) => {
    ai.init({ env: 'test' }, () => {
      ai.apps.list = []
      next()
    })
  })

  it('load app', function() {
    assert(ai.config.env, 'test')
    ai.apps.add('music')
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

  
  it('Resumes playback where last left off', (next)=>{ cid++
    ai.process('envoi de la musique', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Stop playback', (next)=>{ cid++
    ai.process('coupe la musique', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Play next song', (next)=>{ cid++
    ai.process('envoi la chanson d\'apres', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Play previous song', (next)=>{ cid++
    ai.process('met la musique d\'avant', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Music info', (next)=>{ cid++
    ai.process('tu peux me dire le titre de la chanson', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      next()
    })
  })

  it('Finds a song and plays it', (next)=>{ cid++
    ai.process('tu peux me jouer mystere et suspense par fonky family', true, (err, cmd)=>{
      const intent = cmd && cmd.intent
      assert.equal(cid, cmd.cid)
      assert.equal(intent.p1, 'mystere et suspense')
      assert.equal(intent.p2, 'fonky family')
      next()
    })
  })

  it('Finds an artist and plays it', (next)=>{ cid++
    ai.process('tu peux jouer du jack johnson', true, (err, cmd)=>{
      const intent = cmd && cmd.intent
      assert.equal(cid, cmd.cid)
      assert.equal(intent.p1, 'jack johnson')
      next()
    })
  })


  it('Descrease volume', (next)=>{ cid++
    ai.process('baisse le volume', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.intent.action, 'baisse')
      next()
    })
  })

  it('Increase volume', (next)=>{
    ai.process('tu peux augmenter le volume', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.intent.action, 'augmenter')
      next()
    })
  })

  it('Custom volume', (next)=>{ cid++
    ai.process('met le volume sur 25', true, (err, cmd)=>{
      assert.equal(cid, cmd.cid)
      assert.equal(cmd.intent.action, 'met')
      assert.equal(cmd.intent.p2, '25')
      next()
    })
  })

})