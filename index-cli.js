'use strict';
// this allows to import alfy as some tempdirs get created automatically
process.env['AVA'] = 'anything'
const parser = require('./src/parser')
const request = require('./src/request')

let query = parser.parse(process.argv[2])
console.log('Query', query)
request.request(query)
  .then(items => { console.log(items) })
  .catch(err => { console.log(err) })

