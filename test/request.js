'use strict';
const expect = require('chai').expect
const request = require('../src/request')
const http = require('http')
const fs = require('fs')

const json = {
  meta: {
    page: {
      total_results: 2
    }
  },
  results: [
    {
      title: {raw: "Open" },
      product_name: { raw: "Curator" },
      url: { raw: "http://localhost:8000/guide/en/elasticsearch/client/curator/4.0/open.html" }
    },
    {
      title: {raw: "Open Examples" },
      product_name: { raw: "Logstash" },
      url: { raw: "http://localhost:8000/guide/en/guide/en/logstash/foo/examples.html#ex_open" }
    }
  ]
}

describe('request with response', () => {

  let webserver
  let requestCount = 0

  before(() => {
    webserver = http.createServer((req, res) => {
      requestCount++
      res.end(JSON.stringify(json))
    });
    webserver.listen(8000)
  })

  after((done) => {
    webserver.close(done)
  })

  beforeEach(() => { requestCount = 0 })

  it('should not be sent when empty', (done) => {
    request.request({ query: ' ' }, {}, 'http://localhost:8000/suggest')
      .catch(err => done(err))
      .then(items => {
        expect(items).to.have.length(0)
        expect(requestCount).to.equal(0)
        done()
      })
  })

  it('should be stripped from html tags in title', (done) => {
    request.request({ query: 'foo' }, {}, 'http://localhost:8000/suggest')
      .then(items => {
        expect(items[0].title).to.equal('Open')
        expect(requestCount).to.equal(1)
        done()
      })
      .catch(err => { done(err) })
  })

  it('should use different icons', (done) => {
    request.request({ query: 'foo' }, {}, 'http://localhost:8000/suggest')
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
    request.request({ query: 'foo' }, { timeout: 1, retry: 0}, 'http://localhost:8000/suggest')
      .catch(err => {
        expect(err.message).to.equal('Request timed out')
        done()
      })
   })

})

describe('request without response', () => {
  let webserver

  before(() => {
    webserver = http.createServer((req, res) => {
      res.end(JSON.stringify({ meta: { page: {total_results: 0} } }))
    });
    webserver.listen(8000)
  })

  after((done) => {
    webserver.close(done)
  })

  it('should return not found message on zero hits', done => {
    request.request({ query: 'foo' }, {}, 'http://localhost:8000/suggest')
      .then(items => {
        expect(items[0].title).to.equal('No results found')
        done()
      })
      .catch(err => { done(err) })
  })
})
