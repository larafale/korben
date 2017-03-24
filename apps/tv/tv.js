const _ = require('lodash')

const tv = module.exports = {}

tv.find = (text) => {
  return isNaN(text)
    ? _.find(tv.channels, (c) => (new RegExp(c.name, 'i')).test(text))
    : _.find(tv.channels, (c) => parseInt(text, 10) == c.id)
}

tv.channels = [
  { id: 1,  name: 'TF1' },
  { id: 2,  name: 'France 2' }, 
  { id: 3,  name: 'France 3' },
  { id: 4,  name: 'Canal' },
  { id: 5,  name: 'France 5' },
  { id: 6,  name: 'M6' },
  { id: 7,  name: 'Arte' },
  { id: 8,  name: 'C8' },
  { id: 9,  name: 'W9' },
  { id: 10, name: 'TMC' },
  { id: 11, name: 'NT1' },
  { id: 12, name: 'NRJ 12' },
  { id: 13, name: 'LCP' },
  { id: 14, name: 'France 4' },
  { id: 15, name: 'BFM TV' },
  { id: 16, name: 'i TELE' },
  { id: 17, name: 'CSTAR' },
  { id: 18, name: 'Gulli' },
  { id: 19, name: 'France O' },
  { id: 20, name: 'HD1' },
  { id: 21, name: 'Equipe' },
  { id: 22, name: 'Sister' },
  { id: 23, name: '23' },
  { id: 24, name: 'RMC Decouverte' }
]