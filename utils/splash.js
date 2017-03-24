const clc = require('cli-color')
const splash = `

   ██   ██    ██████    ██████    ██████    ███████   ███    ██ 
   ██  ██    ██    ██   ██   ██   ██   ██   ██        ████   ██ 
   █████     ██    ██   ██████    ██████    █████     ██ ██  ██   
   ██  ██    ██    ██   ██   ██   ██   ██   ██        ██  ██ ██   █  @larafale 
   ██   ██    ██████    ██   ██   ██████    ███████   ██   ████   █  version 1.0.0
` // end quote



module.exports = () => {
  process.stdout.write(clc
    .xterm(15)
    .bgXterm(60)
    (splash)
  )

  process.stdout.write('\n')
  process.stdout.write('\n')
}