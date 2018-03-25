var spawn = require('child_process').spawn,
    dummy  = spawn('python', ['test.py']);

dummy.stdout.on('data', function(data) {
    console.log(data);
});