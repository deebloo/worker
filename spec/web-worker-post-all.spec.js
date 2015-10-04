describe('web-worker', function() {
  var workers, myWorker, result;

  beforeEach(function(done) {
    workers = $worker();

    myWorker = workers.create(function(e) {
      var foo = [], min = e.data.min, max = e.data.max;

      for (var i = 0; i < e.data.length; i++) {
        foo.push(Math.floor(Math.random() * (max - min)) + min);
      }

      self.postMessage(foo);
    });

    myWorker.success(function(res) {
      result = res.data;

      done();
    });

    workers.run({length: 1024, min: 0, max: 9999});
  });

  afterEach(function() {
    workers.terminate();
  });

  it('should create a big array', function() {
    expect(result.length).toBe(1024);
  });
});
