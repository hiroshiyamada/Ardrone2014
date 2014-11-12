
var arDrone = require('..');


//get png image after that, create lastpng
var pngStream = arDrone.createClient().getPngStream();

var lastPng;
pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });


/*
//using lastpng, detect faces
var cv = require('opencv');
var face_cascade = new cv.CascadeClassifier('frantalface.xml');

function detectFaces(){
    cv.readImage(lastPng, function(err, im){
	var opts = {};
	face_cascade.detectMultiScale(im, function(err, faces){
	    
	    var face;
	    var biggestFace;

	    for(var k=0; k<faces.length;k++){
		face = faces[k];
		if(!biggestFace
		   || biggestFace.width < face.width){
		}
	    }

	    io.sockets.emit('face', face);
	});
    });
}
*/

var cv = require('opencv');
cv.readImage(lastPng, function(err, im){
  im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
    }
    im.save('./out.jpg');
  });
})
				    