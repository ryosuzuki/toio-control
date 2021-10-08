const fs = require('fs')
const parser = require('gcode-parser')


const file = 'gcode.txt'
let txt = fs.readFileSync(file, 'utf8')

txt = txt.replace(/\\n/g, "\n")
// console.log(txt)
let results = parser.parseLine(txt)


fs.writeFileSync('gcode.json', JSON.stringify(results))
