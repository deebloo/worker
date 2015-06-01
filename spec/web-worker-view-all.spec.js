describe('web-worker-extend', function() {
  var myWorker, myWorker2;

  beforeEach(function() {
    myWorker = $worker.create(function() {
      self.postMessage('Hello World');
    });

    myWorker2 = $worker.create(function() {
      self.postMessage('Hello World');
    });
  });

  afterEach(function() {
    myWorker.terminate();
    myWorker2.terminate();
  });

  it('should extend the entire prototype', function() {
    expect($worker.viewAll().length).toBe(2);
  });
});
