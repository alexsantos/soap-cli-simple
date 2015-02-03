/*global describe, it */
'use strict';
var assert = require('assert');
var soapCliSimple = require('../');

describe('soap-cli-simple node module', function () {
    this.timeout(0);
    it('1 + 2 must result in 3', function (done) {
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
                namespace: 'http://www.oracle-base.com/webservices/'
            };
        soapCliSimple(endpoint, operation, action, message, options).then(function (result) {
            assert.equal(result["Envelope"]["Body"]["ws_addResponse"]["return"], "3");
            done();
        }).catch(console.log);
    });
});