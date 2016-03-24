
//var url = require('url');

var casper = require('casper').create({
	verbose: true
});

//var require = patchRequire(require);

//var url = require('url');

casper.options.onResourceReceived = function(arg, response){

	if (response.stage === 'end' && (response.url.indexOf('google-analytics') > -1)) {
		//console.log(JSON.stringify(response, null, 2));
		console.log(response.status + " = " + response.url);
		//var parsedURL = url.parse(response.url);
                //console.log(JSON.stringify(parsedURL, null, 2));
	}
};


casper.start('http://www.cowboytoyota.com/', function() {
	this.echo(this.getTitle());
});

casper.run();
