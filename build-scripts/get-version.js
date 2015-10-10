var fs   = require('fs'),
    path = require('path');

var file = JSON.parse(fs.readFileSync(path.join(__dirname, '/../bower.json')));

process.stdout.write(file.version);
