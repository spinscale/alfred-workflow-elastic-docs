'use strict'
const CURRENT_VERSION = '7.0'

const _ = require('underscore')

// product matches
const products = {
    // beats
    'b': 'Libbeat', 'mb': 'Metricbeat', 'pb' : 'Packetbeat', 'wb' : 'Winlogbeat', 'fb': 'Filebeat', 'hb' : 'Heartbeat', 'fb' : 'Functionbeat', 'jb' : 'Journalbeat',
    // elasticsearch
    'e': 'Elasticsearch', 'es': 'Elasticsearch',
    // logstash
    'l' : 'Logstash', 'ls': 'Logstash',
    // kibana
    'k': 'Kibana',
    // cloud
    'c': 'Elastic Cloud', 'ece' : 'ECE',
    // stack
    's': 'Elastic Stack',
    // clients
    'cs': 'Clients',
    // infrastructure
    'i': 'Infrastructure',
    // swiftype
    'sw' : 'Swiftype',
    // apm
    'a' : 'APM', 'apm' : 'APM',
    // Elastic common schema
    'ecs' : 'Elastic Common Schema (ecs)'
}

exports.parse = (input) => {
  let query = input

  var product = _.find(Object.keys(products), (key) => { return input.startsWith(key + ' ') })
  if (product !== undefined) {
    query = input.substring(product.length + 1)
  }

  let data = { query: query, version: CURRENT_VERSION }
  // match on version, possible values: 1.[0-9], 2.[0-9], 1.x, 2.x, 3.[0-9], 4.[0-5], 5.0.0-alpha4, (not matched: master, 0.90 - I dont care)
  var versionMatch = query.match("^[0-5]\.[0-9x](\.[0-9](\-[0-9a-z]*)?)?")
  if (product !== undefined) {
    data.product = products[product]
    if (versionMatch !== null) {
      data.version = versionMatch[0]
      data.query = query.substring(versionMatch[0].length + 1)
    }
  }

  return data
}

