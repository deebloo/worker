describe('web-worker-view-all', function() {
  var myWorker, myWorker2, batch;

  beforeEach(function() {
    batch = $worker();

    myWorker = batch.create(function() {
      self.postMessage('Hello World');
    });

    myWorker2 = batch.create(function() {
      self.postMessage('Hello World');
    });
  });

  afterEach(function() {
    myWorker.terminate();
    myWorker2.terminate();
  });

  it('return all of the active workers in a specific group', function() {
    expect(batch.list().length).toBe(2);
  });
});
