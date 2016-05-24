describe('web-worker', function () {
    var workers;

    beforeEach(function () {
        workers = $worker();

        function add(e) {
            self.postMessage(e.data.reduce(function (sum, int) {
                return sum += int;
            }, 0));
        }
        
        function subtract(e) {
            self.postMessage(e.data.reduce(function (sum, int) {
                return sum -= int;
            }, 0));
        }

        workers.create(add);
        workers.create(subtract);
    });

    afterEach(function () {
        workers.terminateAll();
    });

    it('should resolve after all workers finish', function (done) {
        workers
            .runAll([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .then(function (e) {
                var total = e.reduce(function (sum, item) {
                    return sum += item.data;
                }, 0);

                expect(total).toBe(0);
                
                done();
            });
    });
    
    it('should return a list with a length of 2', function () {
        var list = workers.list();
        var worker1 = list[0];
        var worker2 = list[1];
        
        expect(list.length).toBe(2);
        
        worker1.terminate();
        
        expect(list.length).toBe(1);
        
        worker2.terminate();
        
        expect(list.length).toBe(0);
    });
});
