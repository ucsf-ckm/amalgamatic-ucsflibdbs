/*jshint expr: true*/

var dbs = require('../index.js');

var nock = require('nock');
nock.disableNetConnect();

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Lab.expect;
var describe = lab.experiment;
var it = lab.test;

var afterEach = lab.afterEach;

describe('dbs', function () {

	afterEach(function (done) {
		nock.cleanAll();
		done();
	});

	it('returns an empty result if no search term provided', function (done) {
		dbs.search({searchTerm: ''}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns an empty result if no first argument', function (done) {
		dbs.search(null, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result).to.deep.equal({data:[]});
			done();
		});
	});

	it('returns results if a non-ridiculous search term is provided', function (done) {
		nock('https://www.library.ucsf.edu:443')
			.get('/db?filter0=medicine&apage=&filter2=All')
			.reply('200', '<table class="views-table cols-5"><tbody><tr class="odd views-row-first"><td class="views-field views-field-title"><a href="https://example.com/1">Medicine 1</a></td></tr><tr class="even"><td class="views-field views-field-title"><a href="https://example.com/2">Medicine 2</a></td></tr></tbody></table>');

		dbs.search({searchTerm: 'medicine'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data.length).to.equal(2);
			done();
		});
	});

	it('returns an empty result if ridiculous search term is provided', function (done) {
		nock('https://www.library.ucsf.edu:443')
			.get('/db?filter0=fhqwhgads&apage=&filter2=All')
			.reply('200', '<html></html>');

		dbs.search({searchTerm: 'fhqwhgads'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data.length).to.equal(0);
			done();
		});
	});

	it('returns an error object if there was an HTTP error', function (done) {
		dbs.search({searchTerm: 'medicine'}, function (err, result) {
			nock.enableNetConnect();
			expect(result).to.be.not.ok;
			expect(err.message).to.equal('Nock: Not allow net connect for "www.library.ucsf.edu:443"');
			done();
		});
	});

	it('ignores whitespace outside of link label in markup', function (done) {
		nock('https://www.library.ucsf.edu:443')
			.get('/db?filter0=medicine&apage=&filter2=All')
			.reply('200', '<table class="views-table cols-5"><tbody><tr class="odd views-row-first"><td class="views-field views-field-title">   <a href="https://example.com/1">Medicine 1</a>   </td></tr><tr class="even"><td class="views-field views-field-title">	<a href="https://example.com/2">Medicine 2</a>	</td></tr></tbody></table>');

		dbs.search({searchTerm: 'medicine'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data[0].name).to.equal('Medicine 1');
			expect(result.data[1].name).to.equal('Medicine 2');
			done();
		});
	});

	it('returns urls', function (done) {
		nock('https://www.library.ucsf.edu:443')
			.get('/db?filter0=medicine&apage=&filter2=All')
			.reply('200', '<table class="views-table cols-5"><tbody><tr class="odd views-row-first"><td class="views-field views-field-title"><a href="https://example.com/1">Medicine 1</a></td></tr><tr class="even"><td class="views-field views-field-title"><a href="https://example.com/2">Medicine 2</a></td></tr></tbody></table>');

		dbs.search({searchTerm: 'medicine'}, function (err, result) {
			expect(err).to.be.not.ok;
			expect(result.data[0].url).to.equal('https://example.com/1');
			expect(result.data[1].url).to.equal('https://example.com/2');
			done();
		});
	});
});
