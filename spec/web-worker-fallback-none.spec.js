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
    expect(error.message).toBeTruthy();
  });
});
