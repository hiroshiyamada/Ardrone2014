// Run this to receive a png image stream from your drone.

var arDrone = require('ar-drone');
var http = require('http');
var cv = require('opencv');

//global variables
var face;
var camewidth;
var camehight;
//640*360 camera pixels


console.log('Connecting png stream ...');

var pngStream = arDrone.createClient().getPngStream();

var lastPng;
pngStream.on('error', console.log).on('data', function(pngBuffer) {
	console.log('Getting png stream ...');
	lastPng = pngBuffer;

	
	cv.readImage(lastPng, function(err, im) {
		im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
			for (var i = 0; i < faces.length; i++) {
			    //var x = faces[i]
			    face = faces[i]
				//im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);//define center pixel
			    im.ellipse(face.x + face.width / 2, face.y + face.height / 2, face.width / 2, face.height / 2);	    
			}
			im.save('./out.jpg');
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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(function() {
  var ardrone, swarm, _;

  _ = require("underscore");//ファイル読み込み

  ardrone = require("ar-drone");//ファイル読み込み

  swarm = [];//object

  swarm.drones = {};//空

  swarm.forEach = function(iterator) {//constract
    return Object.keys(swarm.drones).forEach(function(id) {
      return iterator(swarm.drones[id]);//for
    });
  };

  swarm["do"] = function(block) {//???
    return swarm.forEach(function(drone) {
      return typeof block === "function" ? block(drone) : void 0;
    });
  };

  swarm.action = function(command) {//swarm start an action
    return swarm.forEach(function(drone) {
      var _name;
      if (drone.enabled) {
        drone.snooze(drone.inactivityTime);
        console.log("drone[" + command.action + "]()");
        return typeof drone[_name = command.action] === "function" ? drone[_name]() : void 0;
      }
    });
  };

  swarm.move = function(control) {//swarm start to move
    return swarm.forEach(function(drone) {
      if (drone.enabled) {
        drone.snooze(drone.inactivityTime);
        return drone.move(control);
      }
    });
  };

  swarm.animate = function(animation) {//swarm animation start
    return swarm.forEach(function(drone) {
      if (drone.enabled) {
        drone.snooze(animation.duration);
        return drone.animate(animation.name, animation.duration);
      }
    });
  };

  swarm.add = function(config) {//swarm connect to drone
    var drone;//drone variables
    drone = ardrone.createClient({
      ip: config.ip
    });
    drone.id = config.id || config.ip.split(".").pop();
    drone.ip = config.ip;
    drone.enabled = false;
    drone.camera = 0;
    drone.changeCamera = function(camera) {//camera on
      if (camera === "toggle") camera = !drone.camera + 0;
      if (typeof camera !== "number") camera = 0;
      drone.config('video:video_channel', '' + camera);
      return drone.camera = camera;
    };

    drone.control = {//initialize
      x: 0,
      y: 0,
      z: 0,
      r: 0
    };

    drone.isIddle = function() {//while drone iddling
      return drone.control.x === 0 && drone.control.y === 0 && drone.control.z === 0 && drone.control.r === 0;
    };

      //drone movement
    drone.move = function(control) { //drone start
      if (control) {
        _.extend(drone.control, control);
        if (control) console.log(drone.control, control, drone.isIddle());
      } else {
        control = drone.control;
      }
      if (drone.isIddle()) {//how to move 
        drone.stop();
      } else {

	  control.x = face.x;//system changing
	  control.y = face.z;//system changing
	  control.z = face.y;//system changing
	  
          if ((control.x - camewidth / 2 )< 0) {//right or left movement
              drone.left(-control.x);
          } else if ((control.x - camewidth / 2 )> 0) {
              drone.right(control.x);
          }
          if (control.y < 0) {//forward or back movement
              drone.back(-control.y);
          } else if (control.y > 0) {
              drone.front(control.y);
          }
          if ((control.z - camehight / 2) < 0) {//up or down movement
              drone.down(control.z - camehight / 2);//minus???
          } else if ((control.z- camehight / 2) > 0) {
              drone.up(-(control.z- camehight / 2));//plus???
          }
          if (control.r < 0) {//turn right or left movement
              drone.counterClockwise(-control.r);
          } else if (control.r > 0) {
              drone.clockwise(control.r);
          }
      }
	return control;
    };

      //drone timeout and alive
    drone.inactivityTime = 200;
    drone.inactivityTimeout = +(new Date) + drone.inactivityTime;
    drone.snooze = function(length) {
      if (drone.inactive) {
        console.log("drone %s snooze (keep alive off)", drone.ip);
      }
      drone.inactive = false;
      return drone.inactivityTimeout = +(new Date) + length;
    };
    drone.keepAlive = function() {
      if (+new Date() > drone.inactivityTimeout) {
        if (!drone.inactive) {
          console.log("drone %s inactive (keep alive on)", drone.ip);
        }
        drone.inactive = true;
        return drone.move();
      }
    };

    setInterval(drone.keepAlive, 30);
    swarm.drones[drone.id] = drone;
    return swarm.push(drone);
  };

  module.exports = swarm;

}).call(this);



