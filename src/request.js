'use strict'
const got = require('got')
const _ = require('underscore')
const striptags = require('striptags')
const path = require('path')

// dirname refers to the current dir, but we need the parent for the right path
const rootDir = path.resolve(__dirname, '..')

const icons = {
  'beat'          : rootDir + '/logos/beats.png',
  'cloud'         : rootDir + '/logos/cloud.png',
  'elasticsearch' : rootDir + '/logos/elasticsearch.png',
  'logstash'      : rootDir + '/logos/logstash.png',
  'kibana'        : rootDir + '/logos/kibana.png',
  'xpack'         : rootDir + '/logos/xpack.png',
  'watcher'       : rootDir + '/logos/xpack.png',
  'marvel'        : rootDir + '/logos/xpack.png',
  'shield'        : rootDir + '/logos/xpack.png',

}

exports.request = (query, url='https://search.elastic.co/suggest', timeout=1000) => {
  return new Promise((resolve, reject) => {
    if (query.q === null || query.q.trim().length == 0) {
      resolve([])
    }
    got(url, {
      json: true,
      timeout: timeout,
      retries: 0,
      query: query
    })
    .then(res => {
      const items = res.body.hits.map(hit => {
        var product = _.find(Object.keys(icons), (name) => { return hit.section.toLowerCase().includes(name) })
        let icon = product !== undefined ? icons[product] : icons['elasticsearch']

        return {
          title: striptags(hit.title),
          subtitle: striptags(hit.section),
          arg: 'https://www.elastic.co' + hit.url,
          icon: { path: icon }
        }
      })

      resolve(items)
    })
    .catch(error => reject(error))
  })
}

