'use strict';
var expect = require('chai').expect;
var parser = require('../lib/parser');

describe('parser', () => {

  it('should parse', (done) => {
    expect(parser.parse('foo').q).to.equal('foo')
    expect(parser.parse('foo').section).to.equal('Learn/Docs/')
    done()
  })

  it('should parse products', (done) => {
    expect(parser.parse('w foo bar').q).to.equal('foo bar')
    expect(parser.parse('w foo').section).to.equal('Learn/Docs/Watcher/Reference/6.3')
    expect(parser.parse('e foo').section).to.equal('Learn/Docs/Elasticsearch/Reference/6.3')
    expect(parser.parse('esp foo').section).to.equal('Learn/Docs/Elasticsearch/Plugins/Reference/6.3')
    done()
  })

  it('should parse products and versions', (done) => {
    expect(parser.parse('w 2.2 foo bar').q).to.equal('foo bar')
    expect(parser.parse('w 2.2 foo bar').section).to.equal('Learn/Docs/Watcher/Reference/2.2')
    done()
  })

})
