'use strict';
var expect = require('chai').expect;
var parser = require('../lib/parser');

describe('parser', () => {

  it('should parse', (done) => {
    expect(parser.parse('foo').q).to.equal('foo')
    expect(parser.parse('foo').section).to.equal('Docs/')
    done()
  })

  it('should parse products', (done) => {
    expect(parser.parse('w foo bar').q).to.equal('foo bar')
    expect(parser.parse('w foo').section).to.equal('Docs/Watcher/')
    expect(parser.parse('e foo').section).to.equal('Docs/Elasticsearch/')
    expect(parser.parse('esp foo').section).to.equal('Docs/Elasticsearch/Plugins/')
    done()
  })

  it('should parse products and versions', (done) => {
    expect(parser.parse('w 2.2 foo bar').q).to.equal('foo bar')
    expect(parser.parse('w 2.2 foo bar').section).to.equal('Docs/Watcher/Reference/2.2')
    done()
  })

})
