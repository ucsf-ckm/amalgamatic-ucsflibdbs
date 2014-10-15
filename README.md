[![Build Status](https://travis-ci.org/ucsf-ckm/amalgamatic-ucsflibdbs.svg?branch=master)](https://travis-ci.org/ucsf-ckm/amalgamatic-ucsflibdbs)

amalgamatic-ucsflibdbs
======================

[Amalgamatic](https://github.com/ucsf-ckm/amalgamatic) plugin for UCSF Library databases

## Installation

Install amalgamatic and this plugin via `npm`:

`npm install amalgamatic amalgamatic-ucsflibdbs`

## Usage

````
var amalgamatic = require('amalgamatic'),
    dbs = require('amalgamatic-ucsflibdbs');

// Set the URL to point to the UCSF Library Database search page 
//   or, if you are using Browserify, a CORS proxy for it
dbs.setOptions({url: 'https://www.library.ucsf.edu/db'});

// Add this plugin to your Amalgamatic instance along with any other plugins you've configured.
amalgamatic.add('dbs', dbs);

//Use it!
var callback = function (err, results) {
    if (err) {
        console.dir(err);
    } else {
        results.forEach(function (result) {
            console.log(result.name);
            console.dir(result.data);
        });
    }
};

amalgamatic.search({searchTerm: 'medicine'}, callback);
````
