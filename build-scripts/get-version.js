var fs = require('fs');

var file = JSON.parse(fs.readFileSync(__dirname + '/../bower.json'));

process.stdout.write(file.version);
