describe('worker - success', function() {
  var myWorker, result;

  beforeEach(function(done) {
    myWorker = $worker.create(function() {
      self.postMessage(hello() + ' ' + world());
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

      done();
    };

    myWorker.postMessage();
  });

  it('should create a big array', function() {
    expect(result).toBe('hello world');
  });
});
