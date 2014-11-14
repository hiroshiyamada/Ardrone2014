// Run this to receive a png image stream from your drone.

var arDrone = require('ar-drone');
var http = require('http');
var cv = require('opencv');

var client  = arDrone.createClient();
client.createRepl();

console.log('Connecting png stream ...');
var pngStream = arDrone.createClient().getPngStream();
var lastPng;

pngStream.on('error', console.log).on('data', function(pngBuffer) {
	//console.log('Getting png stream ...');
	lastPng = pngBuffer;

	cv.readImage(lastPng, function(err, im) {
		im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
			for (var i = 0; i < faces.length; i++) {
				var x = faces[i];
				im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
			}
			im.save('../out.jpg');
		});
	})
});

var server = http.createServer(function(req, res) {
	if (!lastPng) {
		res.writeHead(503);
		res.end('Did not receive any png data yet.');
		return;
	}

	res.writeHead(200, {
		'Content-Type' : 'image/png'
	});
	res.end(lastPng);
});

server.listen(8080, function() {
	console.log('Serving latest png on port 8080 ...');
});