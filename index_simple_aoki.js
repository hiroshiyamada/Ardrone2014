// Run this to receive a png image stream from your drone.
//adding latter code

var arDrone = require('ar-drone');
var http = require('http');
var cv = require('opencv');

var client  = arDrone.createClient();

//add
//global variables
var face_x, face_y;
var camewidth = 640;
var camehight = 360;
//640*360 camera pixels


console.log('Connecting png stream ...');
var pngStream = arDrone.createClient().getPngStream();
var lastPng;

pngStream.on('error', console.log).on('data', function(pngBuffer) {
	//console.log('Getting png stream ...');
	lastPng = pngBuffer;

	cv.readImage(lastPng, function(err, im) {
		im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
			for (var i = 0; i < faces.length; i++) {
			    //var x = face[i];
			    face = faces[i];//change
			    im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
			    face_x = x.x + x.width / 2; //add as center of faces
			    face_y = x.y + x.height / 2; //add as center of faces
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

client.takeoff(function(){
    // ここにコールバック関数を書く
    // node-ar-droneのgithubのREADMEの関数リファレンスを参照する．
    
    //client.up(speed),client.down(speed), front, back, left, righを使う
    //先週のswarm.addの中身を参考にする
    

    //center pointによってspeedを変化させる
    //speed can be a value from 0 to 1 (cf. README)   

    speed = 0;//initialize

    
    if ((face_x - camewidth / 2 )< 0) {//right or left movement
        speed = 1;
	client.left(speed);
    } else if ((control.x - camewidth / 2 )> 0) {
        speed = 1;
	client.right(speed);
    }

    //no touch yet

    if (control.y < 0) {//forward or back movement
        drone.back(-control.y);
    } else if (control.y > 0) {
        drone.front(control.y);
    }

    if ((face_y - camehight / 2) < 0) {//up or down movement
        speed = 1;
	client.up(speed);
    } else if ((face_y- camehight / 2) > 0) {
        speed = 1;
	client.down(speed);
    }
    
    //no touch yet

    if (control.r < 0) {//turn right or left movement
        drone.counterClockwise(-control.r);
    } else if (control.r > 0) {
        drone.clockwise(control.r);
    }
    
    client.land();
});

