describe('web-worker', function () {
    var myWorker;

    beforeEach(function () {
        function workerFunction(e) {
            self.postMessage(self.foo());
        }

        var scriptMap = [
            {
                name: 'foo',
                method: function () {
                    return 'Hello World';
                }
            }
        ]

        myWorker = $worker().create(workerFunction, scriptMap);
    });

    afterEach(function () {
        myWorker.terminate();
    });

    it('should create a big array', function (done) {
        myWorker
            .run()
            .then(function (e) {
                expect(e.data).toBe('Hello World');
                done();
            });
    });
});
