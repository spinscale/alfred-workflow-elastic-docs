'use strict';
var expect = require('chai').expect;
var parser = require('../src/parser');

describe('parser', () => {

  it('should parse', (done) => {
    expect(parser.parse('foo').query).to.equal('foo')
    expect(parser.parse('foo').version).to.equal('7.13')
    done()
  })

  it('should parse products', (done) => {
    expect(parser.parse('a foo bar').query).to.equal('foo bar')
    expect(parser.parse('a foo').product).to.equal('APM')
    expect(parser.parse('e foo').product).to.equal('Elasticsearch')
    done()
  })

  it('should parse products and versions', (done) => {
    expect(parser.parse('a 2.2 foo bar').query).to.equal('foo bar')
    expect(parser.parse('a 2.2 foo bar').product).to.equal('APM')
    expect(parser.parse('a 2.2 foo bar').version).to.equal('2.2')
    done()
  })

})
