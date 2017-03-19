
// const assert = require('chai').assert
// const should = require('chai').should()
// const ai = require('../lib/ai')

// const debug = (err, cmd)=>{
//   console.log(err, cmd)
// }


// describe('lib db', function() {

//   before((next) => {
//     ai.init({ env: 'test' }, () => {
//       ai.bm.list = []
//       next()
//     })
//   })

//   it('load bundle', function() {
//     assert(ai.config.env, 'test')
//     ai.bm.add('music')
//     assert.lengthOf(ai.bm.list, 1)
//   })

//   it('bla bla bla', (next)=>{ 
//     ai.process('bla bla bla', true, (err, cmd)=>{
//       should.exist(err)
//       should.not.exist(cmd)
//       next()
//     })
//   })


//   // Test command in order prior to their position in bundle.cmds

  
//   it('Resumes playback where last left off', (next)=>{ cid++
//     ai.process('envoi du son', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       next()
//     })
//   })

//   it('Stop playback', (next)=>{ cid++
//     ai.process('coupe la musique', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       next()
//     })
//   })

//   it('Play next song', (next)=>{ cid++
//     ai.process('envoi la chanson d\'apres', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       next()
//     })
//   })

//   it('Play previous song', (next)=>{ cid++
//     ai.process('met la musique d\'avant', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       next()
//     })
//   })

//   it('Music info', (next)=>{ cid++
//     ai.process('c\'est quoi le titre de la chanson', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       next()
//     })
//   })

//   it('Finds an artist and plays it', (next)=>{ cid++
//     ai.process('met du jack johnson', true, (err, cmd)=>{
//       const args = cmd && cmd.ctx.args
//       assert.equal(cid, cmd.cid)
//       assert.equal(args[3], 'jack johnson')
//       next()
//     })
//   })

//   it('Finds a song by name and plays it', (next)=>{ cid++
//     ai.process('joue la chanson Adele turning tables', true, (err, cmd)=>{
//       const args = cmd && cmd.ctx.args
//       assert.equal(cid, cmd.cid)
//       assert.equal(args[3], 'Adele turning tables')
//       next()
//     })
//   })

//   it('Descrease volume', (next)=>{ cid++
//     ai.process('baisse le volume mon gars', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       assert.equal(cmd.ctx.args[1], 'baisse')
//       should.not.exist(cmd.ctx.args[2])
//       next()
//     })
//   })

//   it('Increase volume', (next)=>{
//     ai.process('tu peux augmenter le volume mon gars', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       assert.equal(cmd.ctx.args[1], 'augmente')
//       should.not.exist(cmd.ctx.args[2])
//       next()
//     })
//   })

//   it('Custom volume', (next)=>{
//     ai.process('met le volume à 25%', true, (err, cmd)=>{
//       assert.equal(cid, cmd.cid)
//       assert.equal(cmd.ctx.args[1], 'met')
//       assert.equal(cmd.ctx.args[2], '25')
//       next()
//     })
//   })

// })