/**
 * @name $Worker
 *
 * @param {Function} method - the web worker code to be run
 * @param {Function} [fb] - the fallback method to use if the web worker fails
 *
 * @description
 * spin up an inline web worker.
 *
 * @constructor
 */
function $Worker(method, fb) {
  var worker = this;

  // The fallback method to use if web worker failts
  worker.fb = fb;

  // Array to be used for the blob sent to the web worker
  worker.blobArray = ['self.onmessage = ', method, ';'];

  // Create blob from the passed in function
  worker.blob = !!window.Blob ? new Blob(blobArray, { type: "text/javascript" }) : null;

  // does the browser support web workers
  worker.hasWorkers = !!window.Worker;

  // Create new web worker. This worker will be referred to as 'shell' from now on
  worker.shell = worker.hasWorkers ? new Worker(window.URL.createObjectURL(worker.blob)) : method;
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
 * load named function declarations into the web worker to be used by the web worker
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