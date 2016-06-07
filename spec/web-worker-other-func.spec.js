describe('web-worker', function () {
    var myWorker;

    beforeEach(function () {
        function workerFunc() {
            self.postMessage('Hello World');
        }

        myWorker = $worker().create(workerFunc);
    });

    afterEach(function () {
        myWorker.terminate();
    });

    it('should create a big array', function (done) {
        myWorker.run().then(function (e) {
            expect(e.data).toBe('Hello World');
            done();
        });
    });
});
