describe('web-worker', function () {
    var myWorker;

    beforeEach(function () {
        function foo() {
            
        }
        
        myWorker = $worker().create(function (e) {
            var foo = foo;
            
            self.postMessage(e.data.reduce(function (sum, int) {
                return sum += int;
            }, 0));
        });
    });

    afterEach(function () {
        myWorker.terminate();
    });

    it('should create a big array', function (done) {
        myWorker
            .run([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .then(function (e) {
                expect(e.data).toBe(55);
                done();
            });
    });
});
