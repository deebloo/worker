describe('worker - fallback', function() {
  var myWorker, error;

  beforeEach(function(done) {

    myWorker = new $Worker(function(e) {

    }, null, true);

    myWorker.loadScripts(function hello() {});

    myWorker.onmessage = function(err) {
      error = err;
      done();
    };


    myWorker.postMessage({length: 1024, min: 0, max: 9999});
  });

  afterEach(function() {
    myWorker.terminate();
    myWorker = null;
    error = null;
  });

  it('should create a big array', function() {
    expect(error.code).toBe('0001');

    expect(error.message).toBe('web workers are not supported in your current browser and no fallback has been given');
  });
});
