'use strict'
const alfy = require('alfy')
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

exports.request = (query, opts = {}, url='https://host-nm1h2z.api.swiftype.com/api/as/v1/engines/elastic-en-us/search') => {
  if (query.query === null || query.query.trim().length == 0) {
    return Promise.resolve([])
  }
  let json = { query: query.query, page:{ size: 10 },"search_fields":{"title":{"weight":3}, "body":{}},"result_fields":{"title":{"raw":{}},"url":{"raw":{}},"product_name":{"raw":{}}},"filters":{"all":[{"website_area":["documentation"]}]}}
  if (query.product !== null && query.product != undefined) {
    json.filters.all[json.filters.all.length] = {"product_name": [query.product] }
  }
  if (query.version !== null && query.version != undefined) {
    json.filters.all[json.filters.all.length] = {"product_version": [query.version] }
  }

  var headers = { "Authorization": "Bearer search-yq8eq2orbgnmq1jjjfw4hocv" }
  var opts = Object.assign(opts, { method: "POST", body: json, json: true, headers: headers })
  return alfy.fetch(url, opts)
  .then(res => {
    if (res.meta.page.total_results == 0) {
      return Promise.resolve([{ title: 'No results found', icon: { path: rootDir + '/icon.png' } }])
    }
    const items = res.results.map(hit => {
      var product = _.find(Object.keys(icons), (name) => { return hit.product_name.raw.toLowerCase().includes(name) })
      let icon = product !== undefined ? icons[product] : icons['elasticsearch']

      return {
        title: striptags(hit.title.raw),
        subtitle: striptags(hit.product_name.raw),
        arg: hit.url.raw,
        icon: { path: icon }
      }
    })

    return Promise.resolve(items)
  })
}

