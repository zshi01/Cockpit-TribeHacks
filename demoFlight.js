var arDrone = require('ar-drone');
var http    = require('http');

//var pngStream = arDrone.createClient().getPngStream();
var client = arDrone.createClient();
client.disableEmergency();

client.takeoff();

  client
    .after(5000, function() {
      console.log("clockwise");
      this.clockwise(0.5);
    })
    .after(5000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(5000, function() {
      console.log("up");
      this.up(1);
    })
    .after(5000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(5000, function() {
      console.log("front");
      this.front(0.25);
    })
    .after(5000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(5000, function() {
      console.log("left");
      this.left(0.25);
    })
    .after(5000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(5000, function() {
      console.log("right");
      this.right(0.25);
    })
    .after(5000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(5000, function() {
      console.log("back");
      this.back(0.25);
    })

    .after(5000, function() {
      console.log("STOP");
      this.stop();
    })
    .after(1000, function() {
      console.log("land");
      this.stop();
      this.land();
    });
