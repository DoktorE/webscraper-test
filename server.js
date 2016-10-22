var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var totalResults = 0;

// fs.loadFile
keywords = [ "medical+rotation", "medical+rotation+doctor", "medical+clinical+rotation" ];

app.get('/scrape', function(req, res) {
	// search for each keyword
	for (var i = 0; i < keywords.length; i++) {
		request("https://www.google.com/search?q=" + keywords[i], function (err, response, body) {
			if (!err) {
				var $ = cheerio.load(body);
				var links = $(".r a");

				links.each(function (i, link) {
					// grab link from DOM
					var url = $(link).attr("href");

					// strip out junk
					url = url.replace("/url?q=", "").split("&")[0];

					if (url.charAt(0) === "/") {
						return;
					}

					console.log(url);

					totalResults++;

					request(url, function (err, response, body) {
						if (!err) {
							// load page text
							var $page = cheerio.load(body);
							var text = $page("body").text();

							text = text.replace(/\s+/g, " ").replace([/^a-zA-Z ]/g], "").toLowerCase();
						}
						else {
							console.log("Error encounted: " + error);
						}
					});
				});

			} 
			else {
				console.log("Error encountered: " + err);
			}
		});
	}
});


app.listen('8081');
console.log("Listening on port 8081");
exports = module.exports = app;


		// fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
  //   		  console.log('File successfully written');
	 //    })

	 //    res.send(JSON.stringify(json, null, 4));