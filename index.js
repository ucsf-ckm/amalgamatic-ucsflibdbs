var querystring = require('querystring');
var cheerio = require('cheerio');
var https = require('https');

exports.search = function (query, callback) {
    'use strict';

    if (! query || ! query.searchTerm) {
        callback(null, {data: []});
        return;
    }

    var options = {
        host: 'www.library.ucsf.edu',
        port: 443,
        path: '/db?' +
            querystring.stringify({
                filter0: query.searchTerm,
                apage: '',
                filter2: 'All'
            })
    };

    https.get(options, function (resp) {
        var rawData = '';

        resp.on('data', function (chunk) {
            rawData += chunk;
        });

        resp.on('end', function () {
            var $ = cheerio.load(rawData);
            var result = [];
            $('td.views-field-title a').each(function () {
                result.push({
                    'name': $(this).text(),
                    'url': $(this).attr('href')
                });
            });

            callback(null, {data: result});
        });
    }).on('error', function (e) {
        callback(e);
    });
};