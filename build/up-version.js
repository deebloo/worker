/**
 * Increment
 */

var fs = require('fs');

var files = {
  bower: __dirname + '/../bower.json',
  package: __dirname + '/../package.json'
};

var upType = process.argv[2];

fs.readFile(files.bower, function(err, data) {
  upVersion(files.bower, err, data);
});

fs.readFile(files.package, function(err, data) {
  upVersion(files.package, err, data);
});

/**
 * @name upVersion
 *
 * @param {String} writeTo
 * @param {Object} err
 * @param {Object} data
 */
function upVersion(writeTo, err, data) {
  var file, version;

  if(err) { throw err; }

  file = JSON.parse(data);

  version = file.version.split('.');

  version.forEach(function(val, idx) {
    version[idx] = parseInt(val);
  });

  switch(upType) {
    case 'major':
      version[0]++;
      version[1] = 0;
      version[2] = 0;
      break;

    case 'minor':
      version[1]++;
      version[2] = 0;
      break;

    case 'patch':
      version[2]++;
      break;
  }

  file.version = version.join('.');

  fs.writeFileSync(writeTo, JSON.stringify(file, null, 2));
}
