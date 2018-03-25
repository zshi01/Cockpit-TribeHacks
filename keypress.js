var keypress = require('keypress');
var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var s = 0.25;   //unit speed
var verticalspeed = 0.4;
var fly = false

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
require('ar-drone-png-stream')(client, { port: 8888 });
//listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key.name);
  if (key && key.name == 'b' && fly == false) {
    console.log("takeoff");
    client.takeoff();
    fly = true;
  }
  else if (key && key.name == 'b' && fly == true) {
    console.log("land");
    client.land();
    fly = false;
  }
  if (key && key.name == 'space') {
    console.log("stop");
    client.stop()
  }

  if (key && key.name == 'up') {
    console.log("Front");
    client.front();
  }
  if (key && key.name == 'down') {
    console.log("Back");
    client.back()
  }


  if(key&&key.name =='left'){
    console.log("left");
    client.left(s)

  }
  if(key&&key.name =='right'){
    console.log("right");
    client.right(s)
  }


  if (key && key.name == 'w') {
    console.log("up");
    client.up(verticalspeed);
  }
  if (key && key.name == 's') {
    console.log("down");
    client.down(verticalspeed)
  }

  if(key&&key.name =='a'){
    console.log("counterClockwise");
    client.counterClockwise(s)
  }
  if(key&&key.name =='d'){
    console.log("clockwise");
    client.clockwise(s)
  }

  if (key && key.ctrl && key.name == 'c') {
    process.stdin.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
