describe('web-worker-load-scripts', function() {
  var myWorker, result;

  beforeEach(function(done) {
    myWorker = $worker().create(function() {
      self.postMessage(self.hello() + ' ' + self.world());
    });

    myWorker.loadScripts({
      hello: function() {
        return 'hello';
      },
      world: function() {
        return 'world';
      }
    });

    myWorker.onmessage = function(res) {
      result = res.data;

      myWorker.removeScripts('hello', 'world');

      done();
    };

    myWorker.postMessage();
  });

  afterEach(function() {
    myWorker.terminate();
  });

  it('should return strings from the load scripts method', function() {
    expect(result).toBe('hello world');
  });
});
