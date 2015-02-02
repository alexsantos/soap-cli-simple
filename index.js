'use strict';
var request = require('request'),
    xml2js = require('./utils/xml2js');

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
    console.log(xml);
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
            console.time('Promise');
            request.post({
                uri: endpoint,
                body: xml,
                gzip: true,
                headers: headers(action, xml.length),
                rejectUnauthorized: options.rejectUnauthorized,
                secureProtocol: options.secureProtocol
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    xml2js.parseString(body).then(resolve).catch(reject);
                }

            });
        });
};