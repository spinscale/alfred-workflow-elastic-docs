'use strict'
const CURRENT_VERSION = '6.0'

const _ = require('underscore')

// product matches
const products = {
    // beats
    'b': 'Libbeat', 'mb': 'Metricbeat', 'pb' : 'Packetbeat', 'tb' : 'Topbeat', 'wb' : 'Winlogbeat', 'fb': 'Filebeat', 'hb' : 'Heartbeat',
    // elasticsearch
    'e': 'Elasticsearch', 'es': 'Elasticsearch', 'esg': 'Elasticsearch/Definitive Guide', 'esr': 'Elasticsearch/Reference', 'esp': 'Elasticsearch/Plugins',
    // xpack
    'x': 'XPack', 'm': 'Marvel', 'w': 'Watcher', 's': 'Shield', 'g': 'Graph', 'r': 'Reporting',
    // logstash
    'l' : 'Logstash', 'ls': 'Logstash',
    // kibana
    'k': 'Kibana',
    // hadoop
    'h': 'Apache Hadoop',
    // cloud
    'c': 'Cloud', 'ce' : 'Cloud Enterprise',
    // stack
    's': 'Elastic Stack',
    // clients
    'cs': 'Clients'
}

exports.parse = (input) => {
  let query = input
  let section = 'Learn/Docs/'

  var product = _.find(Object.keys(products), (key) => { return input.startsWith(key + ' ') })
  if (product !== undefined) {
    section = 'Learn/Docs/' + products[product] + '/'
    query = input.substring(product.length + 1)
  }

  // match on version, possible values: 1.[0-9], 2.[0-9], 1.x, 2.x, 3.[0-9], 4.[0-5], 5.0.0-alpha4, (not matched: master, 0.90 - I dont care)
  var versionMatch = query.match("^[0-5]\.[0-9x](\.[0-9](\-[0-9a-z]*)?)?")
  if (product !== undefined) {
    if (versionMatch !== null) {
      section = section + 'Reference/' + versionMatch[0]
      query = query.substring(versionMatch[0].length + 1)
    } else {
      section = section + 'Reference/' + CURRENT_VERSION
    }
  }

  return { q: query, section: section }
}

