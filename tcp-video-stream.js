// Run this to receive the raw video stream from your drone as buffers.

var arDrone = require('ar-drone');
var http = require('http');
var common         = require('common');
var net            = require('net');
var assert         = require('assert');
var TcpVideoStream = require('../lib/video/TcpVideoStream');

var videoStream = arDrone.createClient().getVideoStream();
var lastVideo;

videoStream.on('error', console.log).on('data', function(videoBuffer) {
	console.log('Getting video stream ...');
	lastVideo = videoBuffer;
});
/*
var server = http.createServer(function(req, res) {
	if (!lastVideo) {
		res.writeHead(503);
		res.end('Did not receive any video data yet.');
		return;
	}

	res.writeHead(200, {
		'Content-Type' : 'video/mpeg'
	});
	res.end(lastVideo);
});

server.listen(8080, function() {
	console.log('Serving latest png on port 8080 ...');
});
*/


var expectedData = videoStream;
var server = net.createServer(function(connection) {
  connection.write(exPectedData);
});

var events = [];
server.listen(common.TCP_PORT, function() {
  var video = videoStream;

  video.connect(function(err) {
    if (err) { throw err; }

    events.push('connectCb');
  });

  video
    .on('data', function(buffer) {
      assert.equal(buffer.toString(), expectedData);
      video.end();

      events.push('data');
    })
    // Attach a listener so we can have timeout errors without throwing them
    .on('error', function() { })
    .on('close', function() {
      events.push('close');
      server.close();
    });
});

process.on('exit', function() {
  assert.deepEqual(events, ['connectCb', 'data', 'close']);
});

//video.on('data', console.log);
//video.on('error', console.log);
