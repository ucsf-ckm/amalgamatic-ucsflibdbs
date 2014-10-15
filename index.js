var querystring = require('querystring');
var cheerio = require('cheerio');
var https = require('https');
var url = require('url');
var extend = require('util-extend');

var options = {
    url: 'https://www.library.ucsf.edu/db'
};

exports.setOptions = function (newOptions) {
    options = extend(options, newOptions);
};

exports.search = function (query, callback) {
    'use strict';

    if (! query || ! query.searchTerm) {
        callback(null, {data: []});
        return;
    }

    var myUrl = options.url + '?' +
        querystring.stringify({
            filter0: query.searchTerm,
            apage: '',
            filter2: 'All'
        });

    var myOptions = url.parse(myUrl);
    myOptions.withCredentials = false;

    https.get(myOptions, function (resp) {
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

            callback(null, {data: result, url: myUrl});
        });
    }).on('error', function (e) {
        callback(e);
    });
};