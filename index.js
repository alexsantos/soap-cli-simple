'use strict';
var request = require('request'),
    xml2js = require('./utils/xml2js'),
    log4js = require('log4js');

log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'file',
        filename: 'logs/soap-cli-simple.log',
        category: 'soap'
    }]
});

var logger = log4js.getLogger('soap');

function namespaces(ns) {
    var attributes = '';
    for (var name in ns) {
        attributes += name + '="' + ns[name] + '" ';
    }
    return attributes.trim();
}

function envelope(operation, message, options) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        'xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns="' + options.namespace + '" ' +
        namespaces(options.namespaces) + '>';
    if (options.header) {
        xml += '<env:Header>' + options.header + '</env:Header>';
    }
    xml += '<env:Body>' + xml2js.buildObject(message) + '</env:Body>';
    xml += '</env:Envelope>';
    logger.info('Request');
    logger.info(xml);
    return xml;
}

function headers(schema, length) {
    return {
        'SOAPAction': schema,
        'Content-Type': 'text/xml;charset=UTF-8',
        'Content-Length': length,
        'Accept-Encoding': 'gzip',
        'Accept': '*/*'
    };
}

module.exports = function (endpoint, operation, action, message, options) {
    var xml = envelope(operation, message, options);
    return new Promise(
        function (resolve, reject) {
            request.post({
                uri: endpoint,
                body: xml,
                gzip: true,
                headers: headers(action, xml.length),
                rejectUnauthorized: options.rejectUnauthorized,
                secureProtocol: options.secureProtocol
            }, function (error, response, body) {
                if (error) {
                    logger.error('Response');
                    logger.error(error);
                    reject(error);
                } else {
                    logger.info('Response');
                    logger.info(body);
                    xml2js.parseString(body).then(response).catch(reject);
                }

            });
        });
};