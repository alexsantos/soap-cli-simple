/*global describe, it */
'use strict';
var assert = require('assert');
var soapCliSimple = require('../');

describe('soap-cli-simple node module', function() {
  this.timeout(0);
  it('1 + 2 must result in 3', function(done) {
    var endpoint = 'http://oracle-base.com/webservices/server.php',
      operation = 'ws_add',
      action = 'http://oracle-base.com/webservices/server.php/ws_add',
      message = {
        "ws_add": {
          "int1": "1",
          "int2": "2"
        }
      },
      options = {
        namespace: 'http://www.oracle-base.com/webservices/',
        namespaces: [
          'xmlns:ns1="http://www.oracle-base.com/webservices/"',
          'xmlns:ns2="http://www.oracle-base.com/webservices/"'
        ]
      };
    soapCliSimple(endpoint, operation, action, message, options).then(function(result) {
      var actual = result["Envelope"]["Body"]["ws_addResponse"]["return"],
        expected = "3";
      assert.equal(actual, expected);
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('2 + 2 must not result in 3', function(done) {
    var endpoint = 'http://oracle-base.com/webservices/server.php',
      operation = 'ws_add',
      action = 'http://oracle-base.com/webservices/server.php/ws_add',
      message = {
        "ws_add": {
          "int1": "2",
          "int2": "2"
        }
      },
      options = {
        namespace: 'http://www.oracle-base.com/webservices/',
        namespaces: [
          'xmlns:ns1="http://www.oracle-base.com/webservices/"',
          'xmlns:ns2="http://www.oracle-base.com/webservices/"'
        ]
      };
    soapCliSimple(endpoint, operation, action, message, options).then(function(result) {
      var actual = result["Envelope"]["Body"]["ws_addResponse"]["return"],
        expected = "3";
      assert.notEqual(actual, expected);
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('Wrong namespaces must give an error', function(done) {
    var endpoint = 'http://oracle-base.com/webservices/server.php',
      operation = 'ws_add',
      action = 'http://oracle-base.com/webservices/server.php/ws_add',
      message = {
        "ws_add": {
          "int1": "1",
          "int2": "2"
        }
      },
      options = {
        namespace: 'http://www.oracle-base.com/webservices/',
        namespaces: [
          'xmlns:ns1="http://www.oracle-base.com/webservices/"',
          'xmlns:ns2="http://www.oracle-base.com/webservices/"'
        ]
      };
    soapCliSimple(endpoint, operation, action, message, options).then(function(result) {
      var actual = result["Envelope"]["Body"]["ws_addResponse"]["return"],
        expected = "3";
      assert.equal(actual, expected);
      done();
    }).catch(function(err) {
      assert.ifError(err);
      done();
    });
  });

  it('wrong url must give an error', function(done) {
    var endpoint = 'http://oracle-base.co/webservices/server.php',
      operation = 'ws_add',
      action = 'http://oracle-base.com/webservices/server.php/ws_add',
      message = {
        "ws_add": {
          "int1": "1",
          "int2": "2"
        }
      },
      options = {
        namespace: 'http://www.oracle-base.com/webservices/',
        namespaces: [
          'xmlns:ns1="http://www.oracle-base.com/webservices/"',
          'xmlns:ns2="http://www.oracle-base.com/webservices/"'
        ]
      };
    soapCliSimple(endpoint, operation, action, message, options).then(function(result) {
      var actual = result["Envelope"]["Body"]["ws_addResponse"]["return"],
        expected = "3";
      assert.equal(actual, expected);
      done();
    }).catch(function(err) {
      assert.ifError(err);
      done();
    });
  });

});