// Set the start URL
var startUrl = 'http://www.cowboytoyota.com';

// URL variables
var visitedUrls = [], pendingUrls = [];

// Create instances
var casper = require('casper').create({ /*verbose: true, logLevel: 'debug'*/ });
var utils = require('utils');
var helpers = require('./helpers');

// Spider from the given URL
function spider(url) {

	// Add the URL to the visited stack
	visitedUrls.push(url);

	// Filter GA requests
	casper.options.onResourceReceived = function(csp, res) {
		if (res.stage === 'end' && res.url.indexOf('google-analytics') > -1){
			console.log(res.status + ': ' + res.url);
		}
	};

	// Open the URL
	casper.open(url).then(function() {
		
		var baseUrl = this.getGlobal('location').origin;

		// Set the status style based on server status code
		var status = this.status().currentHTTPStatus;
		switch(status) {
			case 200: var statusStyle = { fg: 'green', bold: true }; break;
			case 404: var statusStyle = { fg: 'red', bold: true }; break;
			 default: var statusStyle = { fg: 'magenta', bold: true }; break;
		}

		// Display the spidered URL and status
		this.echo(this.colorizer.format(status, statusStyle) + ' ' + url);

		var links = this.evaluate(function() {
			return Array.prototype.map.call(__utils__.findAll('a'), function(anchor) {
				return anchor.getAttribute('href');
			});
		});

		//Array.prototype.forEach.call(links, function(link) {console.log(link);});

		Array.prototype.forEach.call(links, function(link) {
			var newUrl = helpers.absoluteUri(baseUrl, link);
			if (pendingUrls.indexOf(newUrl) === -1 && visitedUrls.indexOf(newUrl) === -1) {
				pendingUrls.push(newUrl);
			}
		})

		pendingUrls = pendingUrls.filter(function(url) { if (url.indexOf(baseUrl) > -1) { return url;}});

		Array.prototype.forEach.call(pendingUrls, function(url) {console.log(url);});

	});

}

// Start spidering
casper.start(startUrl, function() {
	spider(startUrl);
});

// Start the run
casper.run();
