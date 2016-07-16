'use strict';
const parser = require('./lib/parser')
const request = require('./lib/request')
const alfy = require('alfy')

let query = parser.parse(alfy.input)
request.request(query)
  .then(items => { alfy.output(items) })
  .catch(err => { alfy.error(err) })

