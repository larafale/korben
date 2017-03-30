const _ = require('lodash')
const utils = require('../../utils')

const tv = module.exports = {}

tv.getChannel = (text) => {
  return isNaN(text)
    ? _.find(tv.channels, (c) => (new RegExp(c.name, 'i')).test(text))
    : _.find(tv.channels, (c) => text == c.code)
}

tv.changeChannel = (channel) => {
  channel = typeof channel == 'string'
    ? tv.getChannel(channel)
    : channel

  if(!channel.code) return

  const codes = channel.code.length == 2
    ? [channel.code[0], channel.code[1]]
    : [channel.code]

  let debounce = 0
  codes.forEach(code => {
    setTimeout(() => tv.trigger(code), debounce)
    debounce += 2000
  })

}

tv.trigger = (code) => {
  code = tv.codes[code]
  utils.exec(`ssh pirate@rasp.local 'sudo /home/pirate/apps/ir-slinger/mytv "${code}"'`, (err, stdout, stdin) => {
    // console.log(err, stdout, stdin)
  })
}

tv.channels = [
  { code: '1',   name: 'TF1' },
  { code: '2',   name: 'France 2' }, 
  { code: '3',   name: 'France 3' },
  { code: '4',   name: 'Canal' },
  { code: '5',   name: 'France 5' },
  { code: '6',   name: 'M6' },
  { code: '7',   name: 'Arte' },
  { code: '8',   name: 'C8' },
  { code: '9',   name: 'W9' },
  { code: '10',  name: 'TMC' },
  { code: '11',  name: 'NT1' },
  { code: '12',  name: 'NRJ 12' },
  { code: '13',  name: 'LCP' },
  { code: '14',  name: 'France 4' },
  { code: '15',  name: 'BFM TV' },
  { code: '16',  name: 'i TELE' },
  { code: '17',  name: 'CSTAR' },
  { code: '18',  name: 'Gulli' },
  { code: '19',  name: 'France O' },
  { code: '20',  name: 'HD1' },
  { code: '21',  name: 'Equipe' },
  { code: '22',  name: 'Sister' },
  { code: '23',  name: '23' },
  { code: '24',  name: 'RMC Decouverte' }
]

tv.codes = {
  0:      '11100000111000001000100001110111',
  1:      '11100000111000000010000011011111',
  2:      '11100000111000001010000001011111',
  3:      '11100000111000000110000010011111',
  4:      '11100000111000000001000011101111',
  5:      '11100000111000001001000001101111',
  6:      '11100000111000000101000010101111',
  7:      '11100000111000000011000011001111',
  8:      '11100000111000001011000001001111',
  9:      '11100000111000000111000010001111',
  power:  '11100000111000000100000010111111',
  vup:    '11100000111000001110000000011111',
  vdown:  '11100000111000001101000000101111',
  cup:    '11100000111000000100100010110111',
  cdow:   '11100000111000000000100011110111'
}

