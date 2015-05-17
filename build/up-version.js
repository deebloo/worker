var fs = require('fs');

var files = {
  bower: __dirname + '/../bower.json',
  package: __dirname + '/../package.json'
};

var upType = process.argv[2];

var bower = fs.readFileSync(files.bower);

var pdk = fs.readFileSync(files.package);

upVersion(files.bower, bower);
upVersion(files.package, pdk);

/**
 * @name upVersion
 *
 * @param {String} writeTo
 * @param {Object} data
 */
function upVersion(writeTo, data) {
  var file, version;

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
