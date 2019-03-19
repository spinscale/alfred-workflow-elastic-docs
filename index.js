'use strict';
const parser = require('./src/parser')
const request = require('./src/request')
const alfy = require('alfy')

let query = parser.parse(alfy.input)
request.request(query)
  .then(items => { alfy.output(items) })

