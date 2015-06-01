describe('web-worker-extend', function() {
  var myWorker;

  beforeEach(function() {
    myWorker = $worker.create(function() {
      self.postMessage('Hello World');
    });
  });

  afterEach(function() {
    myWorker.terminate();
  });

  it('should extend the entire prototype', function() {
    it('should not fail');
  });
});
