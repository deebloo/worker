describe('web-worker', function () {
    var myWorker;

    beforeEach(function () {
        function workerFunc() {
            self.postMessage(foo());
        }

        function otherFunc() {
            return 'Hello World';
        }

        myWorker = $worker().create(workerFunc, 'self.otherFunc = ', otherFunc);
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
