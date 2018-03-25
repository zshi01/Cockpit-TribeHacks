var arDrone = require('ar-drone');
var client = arDrone.createClient();
var PaVEParser = require('ar-drone/lib/video/PaVEParser');

var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
var sec  = date.getSeconds();
time = String(hour) + ":" + String(min) + ":" + String(sec)
loc = './video-'  + time+ '.h264' 
var output = require('fs').createWriteStream(loc);

var video = arDrone.createClient().getVideoStream();
var parser = new PaVEParser();

parser
  .on('data', function(data) {
    output.write(data.payload);
  })
  .on('end', function() {
    output.end();
  });

video.pipe(parser);

client.takeoff();

  client
    .after(2000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(2000, function() {
      console.log("Up");
      this.up(0.2);
    // })
    // .after(2000, function() {
    //   console.log("Stop");
    //   this.stop();
    // })
    // .after(2000, function() {
    //   console.log("Right");
    //   this.right(0.25);
    // })
    // .after(1000, function() {
    //   console.log("STOP");
    //   this.stop();
    // })
    // .after(2000, function() {
    //   console.log("Left");
    //   this.left(0.25);
    // })
    // .after(1000, function() {
    //   console.log("STOP");
    //   this.stop();
    // })
    // .after(5000, function() {
    //   console.log("Up");
    //   this.up(0.3);
    // })
    .after(2000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(5000, function() {
      console.log("land");
      this.land();
    });
