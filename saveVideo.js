// Run this to save a h264 video file, with the PaVE frame filtered out.
// You can then use this file as a ffmpeg source for additional processing
// or streaming to a ffserver

var arDrone = require('ar-drone');
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