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
  this.method = method;

  this.fb = fb;

  // Array to be used for the blob sent to the web worker
  this.blobArray = ['self.onmessage = ', method.toString(), ';'];

  // Create blob from the passed in function
  this.blob = new Blob(this.blobArray, { type: "text/javascript" });

  // does the browser support web workers
  this.hasWorkers = !!window.Worker;

  // Create new web worker. This worker will be referred to as 'shell' from now on
  this.shell = this.hasWorkers ? new Worker(window.URL.createObjectURL(this.blob)) : method;
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

  if(worker.hasWorkers) {
    window.URL = window.URL || window.webkitURL;

    worker.shell.postMessage(data);

    worker.shell.onmessage = function(res) {
      worker.onmessage(res.data);
    };
  }
  else {
    if(typeof worker.fb === 'function') {
      worker.fb(data);
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


/**
 * @name loadScripts
 *
 * @memberof $worker
 *
 * @description
 *
 */
$Worker.prototype.loadScripts = function loadScripts() {
  var funcs = arguments, worker = this;

  for(var i = 0, len = funcs.length; i < len; i++) {
    worker.blobArray.push(funcs[i].toString());
  }

  worker.blob = new Blob(worker.blobArray, {
    type: "text/javascript"
  });

  // Create new web worker. This worker will be referred to as 'shell' from now on
  worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
};