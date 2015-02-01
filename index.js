'use strict';
var request = require('request'),
    xml2js = require('xml2js'),
    zlib = require('zlib');

function namespaces(ns) {
    var attributes = '';
    for (var name in ns) {
        attributes += `${name}="${ns[name]}"`;
    }
    return attributes.trim();
}

function gunzip(data) {
    var buffer = new Buffer(data);
    zlib.unzip(buffer, function (err, buffer) {
        if (!err) {
            return buffer.toString();
        }
    });
}

function isGzipped(response) {
    return /gzip/.test(response.headers['content-encoding']);
}

function envelope(operation, message, options) {
    var xml = '<?xml version="1.0" encoding="UTF-8"?>',
        builder = new xml2js.Builder({
            "headless": true
        });

    xml += `<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" ${namespaces(options.namespaces)}>`;
    if (options.header) {
        xml += `<env:Header>${options.header}</env:Header>`;
    }
    xml += `<env:Body>${builder.buildObject(message)}</env:Body>`;
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

function parseString(str) {
    var prefixMatch = new RegExp(/(?!xmlns)^.*:/),
        stripPrefix = function (str) {
            return str.replace(prefixMatch, '');
        },
        parser = new xml2js.Parser({
            ignoreAttrs: true,
            explicitArray: false,
            firstCharLowerCase: true,
            tagNameProcessors: [stripPrefix]
        });
    return new Promise(
        function (resolve, reject) {
            parser.parseString(str, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
}

module.exports = function (endpoint, operation, action, message, options) {
    console.log('Start');
    var xml = envelope(operation, message, options);

    return new Promise(
        function (resolve, reject) {
            console.time('Promise');
            request.post({
                uri: endpoint,
                body: xml,
                headers: headers(action, xml.length),
                rejectUnauthorized: options.rejectUnauthorized,
                secureProtocol: options.secureProtocol
            }, function (error, response, body) {
                if (error) {
                    //console.log(error);
                    reject(error);
                } else {
                    if (isGzipped(response)) {
                        console.log('gunzip');
                        body = gunzip(body);
                    }
                    parseString(body).then(JSON.stringify).then(resolve).catch(reject);
                }

            });
        });
};