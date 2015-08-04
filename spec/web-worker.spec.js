describe('web-worker', function() {
  var myWorker, result;

  beforeEach(function(done) {
    myWorker = $worker().create(function(e) {
      var foo = [], min = e.data.min, max = e.data.max;

      for (var i = 0; i < e.data.length; i++) {
        foo.push(Math.floor(Math.random() * (max - min)) + min);
      }

      self.postMessage({
        array: foo,
        url: e.data._src
      });
    });

    myWorker.onmessage = function(res) {
      result = res.data;

      done();
    };

    myWorker.postMessage({length: 1024, min: 0, max: 9999});
  });

  afterEach(function() {
    myWorker.terminate();
  });

  it('should create a big array', function() {
    expect(result.array.length).toBe(1024);

    expect(result.url).toBe('http://localhost:14523');
  });
});
