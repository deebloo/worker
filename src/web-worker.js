/**
 * @name $Worker
 *
 * @param {Function} method - the web worker code to be run
 * @param {Function} [fb] - the fallback method to use if the web worker fails
 * @param {Boolean} [debug] - manually set the workers to fallback
 *
 * @description
 * spin up an inline web worker.
 *
 * @constructor
 */
function $Worker(method, fb, debug) {
  var worker = this;

  worker.fb = fb;

  worker.hasWorkers = debug ? false : !!window.Worker;

  worker.blob = null;

  worker.shell = null;

  worker.blobArray = ['self.onmessage = ', method, ';'];

  if(worker.hasWorkers) {
    worker.blob = new Blob(worker.blobArray, { type: "text/javascript" });

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }
}

/**
 * @name postMessage
 *
 * @memberof $Worker
 *
 * @description
 * run the created web worker
 *
 * @param {*} [data] - the data to be passed to the worker
 */
$Worker.prototype.postMessage = function postMessage(data) {
  var worker = this;

  if(worker.hasWorkers) {
    worker.shell.postMessage(data);

    worker.shell.onmessage = function(res) {
      worker.onmessage(res.data);
    };
  }
  else {
    if(typeof worker.fb === 'function') {
      worker.onmessage(worker.fb({data: data}));
    }
    else {
      var errMessage = 'web workers are not supported in your current browser';

      console.error(errMessage);

      worker.onmessage({
        message: errMessage
      });
    }
  }
};

/**
 * @name onmessage
 *
 * @memberof $Worker
 *
 * @description
 * override this method to when listening for the worker to complete
 */
$Worker.prototype.onmessage = function onmessage() { };

/**
 * @name terminate
 *
 * @memberof $Worker
 *
 * @description
 * terminate the created web worker
 */
$Worker.prototype.terminate = function terminate() {
  var worker = this;

  if(worker.hasWorkers) {
    worker.shell.terminate();
  }
};


/**
 * @name loadScripts
 *
 * @memberof $Worker
 * @memberof $Worker
 *
 * @description
 * load named functions into the web worker to be used by the web worker
 */
$Worker.prototype.loadScripts = function loadScripts() {
  var worker = this;

  for(var i = 0, len = arguments.length; i < len; i++) {
    worker.blobArray.push(arguments[i]);
  }

  if(worker.hasWorkers) {
    worker.blob = new Blob(worker.blobArray, { type: "text/javascript"});

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }
};