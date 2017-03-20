
const assert = require('chai').assert
const should = require('chai').should()
const ai = require('../lib/ai')
let cid = -1

const regex = /((je|tu) \w+)?\s?(m'|m.\s)?\s?(\w+)(\smoi)?\s?(la|de l.|du|des)?\s?(.+)\s(a la|dans l.|par|au|sur)\s(.+)/i
// const regex = /(.*)/gi

const debug = (err, cmd)=>{
  console.log(err, cmd)
}

const list = [

  {
    s: "ajoute du pain d epice a la liste",
    verb: 'ajoute', a: 'pain d epice', b: 'liste'
  }, {
    s: "allume la lumiere du salon",
    verb: 'allume', a: 'lumiere', b: 'salon'
  }, {
    s: "tu peux rajouter des tounerdos dans le panier",
    verb: 'rajouter', a: 'tounerdos', b: 'panier'
  }, {
    s: "tu peux boire du coca-cola sur mars",
    verb: 'boire', a: 'coca-cola', b: 'mars'
  }, {
    s: "tu peux mettre de l'huile de tournesol dans la liste de course",
    verb: 'mettre', a: 'huile de tournesol', b: 'liste de course'
  }, {
    s: "joue moi du Rage against The machine sur spotify",
    verb: 'joue', a: 'Rage against The machine', b: 'spotify'
  }, {
    s: "tu peux me jouer pour que tu m'aime encore par celine dion",
    verb: 'jouer', a: 'pour que tu m\'aime encore', b: 'celine dion'
  }

]


describe('fridge bundle', function() {

  before((next) => {
    next()
  })
  
  it('all regex should pass', ()=>{ cid++
    
    list.forEach((text) => {

      const match = text.s.match(regex)

      if(!match) {
        console.log(`err: ${text.s}`)
      }else{

        const verb = match[4]
        const a = match[7]
        const b = match[9]

        const output = {
          text,
          verb,
          a,
          b,
        }

        console.log('-----------')
        console.log(output)

        assert.lengthOf(match, 10)
        assert.equal(text.verb, verb)
        assert.equal(text.a, a)
        assert.equal(text.b, b)
        // console.log(match)
      }

    })

    // next()

  })


})


