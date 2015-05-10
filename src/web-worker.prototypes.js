/**
 * @name $Worker
 *
 * @param {Function} method
 * @param {Function} [fb]
 *
 * @description
 * spin up an inline web worker.
 *
 * @constructor
 */
function $Worker(method, fb) {
  // Create blob from the passed in function
  var blob = new Blob(['self.onmessage = ' + method.toString()], {
    type: "text/javascript"
  });

  // Create new web worker. This worker will be referred to as '_shell' from now on
  this._shell = new Worker(window.URL.createObjectURL(blob));

  this._method = method;

  this._fb = fb;
}

/**
 * @name run
 *
 * @memberof $worker
 *
 * @description
 * run the created web worker
 *
 * @param {*} [data] - the data to be passed to the worker
 */
$Worker.prototype.postMessage = function postMessage(data) {
  var worker = this;

  if(!!window.Worker) {
    window.URL = window.URL || window.webkitURL;

    worker._shell.postMessage(data);

    worker._shell.onmessage = function(res) {
      worker.onmessage(res.data);
    };
  }
  else {
    if(typeof this._fb === 'function') {
      this._fb(data);
    }
    else {
      throw 'web workers are not supported in your current browser';
    }
  }
};

/**
 * @name onmessage
 *
 * @memberof $worker
 *
 * @description
 * override this method to when listening for the worker to complete
 */
$Worker.prototype.onmessage = function onmessage() { };

/**
 * @name terminate
 *
 * @memberof $worker
 *
 * @description
 * terminate the created web worker
 */
$Worker.prototype.terminate = function terminate() {
  var worker = this;

  worker._shell.terminate();
};