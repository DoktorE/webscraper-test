var fs = require('fs');

function file_append_log(path, buffer) {
	fs.appendFile(path, buffer + "\n", function(error) {
		if (error) {
			return console.log("Could not log to file: " + path);
		}
		else {
			return; //console.log("Successfully logged buffer to file " + path);
		}
	});
}

function file_append_static_log(buffer) {
	fs.appendFile("logs/log.txt", buffer + "\n", function(error) {
		if (error) {
			return console.log("Could not log to file: " + "logs/log.txt");
		}
		else {
			return console.log("Successfully logged buffer to file " + "logs/log.txt");
		}
	});
}

function file_write_log(path, buffer) {
	fs.writeFile(path, buffer + "\n", function(error) {
		if (error) {
			return console.log("Could not write to file" + path);
		}
		else {
			return console.log("Successfully wrote to file " + path);
		}
	});
}

module.exports.file_alog = file_append_log;
module.exports.file_aslog = file_append_static_log;
module.exports.file_log = file_write_log;