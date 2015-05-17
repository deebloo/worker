describe('worker - success', function() {
  var myWorker, result;

  beforeEach(function(done) {
    var hello = function hello() { };

    var goodbye = function goodbye() { };

    myWorker = new $Worker(function(e) {
      var foo = [], min = e.data.min, max = e.data.max;

      for (var i = 0; i < e.data.length; i++) {
        foo.push(Math.floor(Math.random() * (max - min)) + min);
      }

      hello();

      self.postMessage(foo);
    });

    myWorker.loadScripts({'hello': hello}, {'goodbye': goodbye});

    myWorker.onmessage = function(data) {
      result = data;

      done();
    };

    myWorker.postMessage({length: 1024, min: 0, max: 9999});
  });

  afterEach(function() {
    myWorker.removeScripts('hello', 'goodbye');
    myWorker.terminate();
    myWorker = null;
    result = null;
  });

  it('should create a big array', function() {
    expect(result.length).toBe(1024);
  });
});
