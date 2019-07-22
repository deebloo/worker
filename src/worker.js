(function () {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = $worker;
    } else {
        window.$worker = $worker;
    }

    function $worker() {
        var workers = [];

        // PUBLIC_API
        return {
            create: create,
            runAll: runAll,
            terminateAll: terminateAll,
            list: list
        }

        /**
         * create a new worker instance and saves it to the list
         *
         * @param {Function} fn - the function to run in the worker
         * @param {[{name: string, method: Function}} - a list of other functions to be available inside the worker function
         */
        function create(fn, otherScripts) {
            var newWorker = _createWorker.apply(null, arguments);

            workers.push(newWorker);

            return newWorker;
        }

        /**
         * run all of the workers in the array and resolve all
         */
        function runAll(data) {
            var promises = workers.map(function (worker) {
                return worker.run(data);
            });

            return Promise.all(promises);
        }

        /**
         * terminate all workers
         */
        function terminateAll() {
            workers.forEach(function (worker) {
                worker._shell.terminate();
            });

            workers.length = 0;
        }

        /**
         * returns the list of current workers
         */
        function list() {
            return workers;
        }

        /**
         * Create an actual web worker from an object url from a blob
         *
         * @param {Function} fn - the function to be put into the blog array.
         * @param {[{name: string, method: Function}} - a list of other functions to be available inside the worker function
         */
        function _createWorker(fn, otherScripts) {
            otherScripts = otherScripts || [];

            var blobArray = otherScripts.map(function (script) {
                return 'self.' + script.name + '=' + script.value.toString() + ';';
            });
            blobArray = blobArray.concat(['self.onmessage=', fn.toString(), ';']);

            var blob = new Blob(blobArray, { type: 'text/javascript' });
            var url = URL.createObjectURL(blob);

            return {
                // the web worker instance
                _shell: (function () {
                    var worker = new Worker(url);

                    URL.revokeObjectURL(url);

                    return worker;
                })(),

                // run the web worker
                run: function (data) {
                    return __run(this._shell, data);
                },

                // terminate the web worker
                terminate: function () {
                    return __terminate(this);
                },

                // subscribe to the worker
                subscribe: function (fn) {
                    this._shell.addEventListener('message', fn);
                },

                // ubsubscribe from the worker
                unsubscribe: function (fn) {
                    this._shell.removeEventListener('message', fn);
                }
            };
        }

        /**
         * run the passed in web worker
         */
        function __run(worker, data) {
            data = data || {};

            worker.postMessage(data);

            var promise = new Promise(function (resolve, reject) {
                worker.onmessage = resolve;
                worker.onerror = reject;
            });

            return promise;
        }

        /**
         * terminate the web worker;
         */
        function __terminate(ref) {
            workers.splice(workers.indexOf(ref), 1);

            return ref._shell.terminate();
        }
    }
})();
