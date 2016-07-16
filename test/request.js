'use strict';
const expect = require('chai').expect
const request = require('../lib/request')
const http = require('http')
const fs = require('fs')

const json = {
  hits: [
    {
      title: "<em>Open</em>",
      tags: "Clients",
      section: "Docs/",
      url: "/guide/en/elasticsearch/client/curator/4.0/open.html"
    },
    {
      title: "<em>open</em> » Examples",
      tags: "Clients",
      section: "Docs/Logstash/",
      url: "/guide/en/logstash/foo/examples.html#ex_open"
    }
  ]
}

describe('request', () => {

  let webserver
  let requestCount = 0

  before(() => {
    webserver = http.createServer((req, res) => {
      requestCount++
      res.end(JSON.stringify(json))
    });
    webserver.listen(8000)
  })

  beforeEach(() => { requestCount = 0 })

  it('should not be sent when empty', (done) => {
    request.request({ q: ' ' }, 'http://localhost:8000/suggest')
      .catch(err => done(err))
      .then(items => {
        expect(items).to.have.length(0)
        expect(requestCount).to.equal(0)
        done()
      })
  })

  it('should be stripped from html tags in title', (done) => {
    request.request({ q: 'foo' }, 'http://localhost:8000/suggest')
      .then(items => {
        expect(items[0].title).to.equal('Open')
        expect(requestCount).to.equal(1)
        done()
      })
      .catch(err => { done(err) })
  })

  it('should use different icons', (done) => {
    request.request({ q: 'foo' }, 'http://localhost:8000/suggest')
      .then(items => {
        expect(items[0].icon.path).to.match(/logos\/elasticsearch.png/)
        expect(items[1].icon.path).to.match(/logos\/logstash.png/)
        expect(requestCount).to.equal(1)
        items.map(item => fs.accessSync(item.icon.path, fs.constants.R_OK))
        done()
      })
      .catch(err => { done(err) })
  })

  it('should return reject promise on error', (done) => {
    request.request({ q: 'foo' }, 'http://localhost:8000/suggest', 1)
      .catch(err => {
        expect(err.message).to.equal('Connection timed out on request to localhost:8000')
        done()
      })
   })
})
