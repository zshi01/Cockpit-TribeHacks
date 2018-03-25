var keypress = require('keypress');
var arDrone = require('ar-drone');
var client  = arDrone.createClient();

var s = 0.1;   //unit speed
var verticalspeed = 0.15;
var fly = false
var moving = false
var pilot = false
var sleep = 3000

var spawn = require('child_process').spawn,
    ls    = spawn('python3',['-u','test_run_webcam.py']);
    // ls    = spawn('python',['-u','test.py']);

ls.stdout.on('data', function(data) {
    if (data.toString() === "UP\n" && pilot == true){
    	console.log("^^^^^^");
    	console.log(data.toString());
    	client.up(verticalspeed)
    }
    if (data.toString() === "DOWN\n" && pilot == true){
    	console.log("VVVVVV");
    	console.log(data.toString());
    	client.down(verticalspeed)
    }
    if (data.toString() === "LEFT\n" && pilot == true){
    	console.log("<<<<--");
    	console.log(data.toString());
    	client.left(s)
    }
    if (data.toString() === "RIGHT\n"  && pilot == true){
    	console.log("-->>>>");
    	console.log(data.toString());
    	client.right(s)}
    if (data.toString() === "HOVER\n" && pilot == true){
    	console.log("------");
    	console.log(data.toString());
    	client.stop();}
    })


keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key.name);
  if (key && key.name == 'up') {
    console.log("takeoff");
    client.takeoff(); 
    setTimeout(function(){client.up(verticalspeed)},1000); 
    setTimeout(function(){client.stop()},2000); 
  }
  else if (key && key.name == 'down') {
    console.log("land");
    client.land();
  }
  if (key && key.name == 'space') {
    console.log("stop");
    client.stop()
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
    console.log("Up");
    client.up(verticalspeed);
    setTimeout(function(){client.stop()},1000);
  }
  if (key && key.name == 's') {
    console.log("Down");
    client.down(verticalspeed);
    setTimeout(function(){client.stop()},1000);
  }
  if (key && key.name == 'f') {
    console.log("Front");
    client.front(s);
    setTimeout(function(){client.stop()},1000);
  }
  if (key && key.name == 'b') {
    console.log("Back");
    client.back(s);
    setTimeout(function(){client.stop()},1000);
  }

  if (key && key.name == 'o') {
    console.log("Start");
    pilot = true
  }
  if (key && key.name == 'p') {
    console.log("OFF");
    pilot = false
  }
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();