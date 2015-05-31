describe('web-worker-extend', function() {
  var myWorker, myWorker2, result;

  beforeEach(function() {
    myWorker = $worker.create(function() {
      self.postMessage('Hello World');
    });

    myWorker2 = $worker.create(function() {
      self.postMessage('Hello World');
    });
  });

  it('should create a big array', function() {
    expect(myWorker.foo).toBe(undefined);
    expect(myWorker2.foo).toBe(undefined);

    $worker.extend({
      foo: true
    });

    myWorker.bar = true;

    expect(myWorker.foo).toBe(true);
    expect(myWorker2.foo).toBe(true);

    expect(myWorker.bar).toBe(true);
    expect(myWorker2.bar).toBe(undefined);
  });
});
