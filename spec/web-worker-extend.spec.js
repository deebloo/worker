describe('web-worker-extend', function() {
  var myWorker, myWorker2, myWorker3, batch;

  beforeEach(function() {
    batch = $worker().extend({
      hello: 'world'
    });

    myWorker = batch.create(function() {
      self.postMessage('Hello World');
    });

    myWorker2 = batch.create(function() {
      self.postMessage('Hello World');
    });

    myWorker3 = $worker().create(function() {
      self.postMessage('I am all alone!');
    });
  });

  afterEach(function() {
    myWorker.terminate();
    myWorker2.terminate();
  });

  it('should extend the entire prototype', function() {
    expect(myWorker.foo).toBe(undefined);
    expect(myWorker2.foo).toBe(undefined);
    expect(myWorker3.foo).toBe(undefined);

    batch.extend({
      foo: true
    });

    expect(myWorker.foo).toBe(true);
    expect(myWorker2.foo).toBe(true);
    expect(myWorker3.foo).toBe(undefined);

    myWorker.bar = true;

    expect(myWorker.bar).toBe(true);
    expect(myWorker2.bar).toBe(undefined);
    expect(myWorker3.bar).toBe(undefined);
  });
});
