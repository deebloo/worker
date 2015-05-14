describe('worker - no listener', function() {
  var myWorker, result;

  beforeEach(function() {
    myWorker = new $Worker(function(e) {
      var foo = [], min = e.data.min, max = e.data.max;

      for (var i = 0; i < e.data.length; i++) {
        foo.push(Math.floor(Math.random() * (max - min)) + min);
      }

      self.postMessage(foo);
    });

    myWorker.postMessage({length: 1024, min: 0, max: 9999});
  });

  afterEach(function() {
    myWorker.terminate();
    myWorker = null;
    result = null;
  });

  it('should create a big array', function() {

  });
});
