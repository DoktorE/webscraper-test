/*
TODO:
Sort words by occurence and then do google searches on the most frequent word up to x #
*/
var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fslog	= require('./node_fslog/fslog.js');
var app = express();

var totalResults = 0;
var corpus = {};

// fs.loadFile
keywords = [ "medical+rotation", "quantum+physics", "skyrim-modding"];

function callback () {
	var words = [];
	
	// stick all words in an array
	for (prop in corpus) {
		words.push({
			word: prop,
			count: corpus[prop]
		});
	}
	
	// sort array based on how often they occur
	words.sort(function (a, b) {
		return b.count - a.count;
	});
	
	console.log(words[0]);
}
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

					//fslog.file_alog('./logs/sitesvisited.txt', url);

					totalResults++;

					request(url, function (err, response, body) {
						if (!err) {
							// load page text
							var $page = cheerio.load(body);
							var text = $page("body").text();

							text = text.replace(/\s+/g, " ").replace([/^a-zA-Z ]/g], "").toLowerCase();

							text.split(" ").forEach(function (word) {
								// filter word length
								if (word.length < 4 || word.length > 20) {
									return;
								}

								if (corpus[word]) {
									corpus[word]++;
								}
								else {
									corpus[word] = 1;
								}
							});

							callback()
						}
						else {
							console.log("Error encounted: " + err);
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
    	//	  console.log('File successfully written');
	   //   })
	  //    res.send(JSON.stringify(json, null, 4));