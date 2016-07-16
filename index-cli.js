'use strict';
const parser = require('./lib/parser')
const request = require('./lib/request')

let query = parser.parse(process.argv[2])
console.log('Query', query)
request.request(query)
  .then(items => { console.log(items) })
  .catch(err => { console.log(err) })

