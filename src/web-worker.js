/**
 * @name $Worker
 *
 * @param {Function} method  - the web worker code to be run
 * @param {Function} [fb]    - the fallback method to use if the web worker fails
 * @param {Boolean}  [debug] - manually set the workers to fallback
 *
 * @description
 * spin up an embedded web worker.
 *
 * @constructor
 */
function $Worker(method, fb, debug) {
  var worker = this;

  /* @protected */
  var errors = {
    '0001': 'web workers are not supported in your current browser and no fallback has been given'
  };

  /* @protected */
  var blobArray = ['self.onmessage = ', method, ';']; // array to be used for blob

  worker.hasWorkers = debug ? false : !!window.Worker; // does the browser have workers
  worker.blob = null; // blob container
  worker.shell = null; // shell container

  worker.fb = fb;

  if(worker.hasWorkers) {
    worker.blob = new Blob(blobArray, { type: "text/javascript" });

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }

  worker.errorHandler = errorHandler;
  worker.getBlobArray = getBlobArray;
  worker.updateBlobArray = updateBlobArray;

  /**
   * @name errorHandler
   *
   * @memberof $Worker
   *
   * @param {String} code - the error code
   *
   * @return {{code: String, message: String}}
   */
  function errorHandler(code) {
    return {
      code: code,
      message: errors[code]
    };
  }

  /**
   * @name getBlobArray
   *
   * @memberof $Worker
   *
   * @return {Array}
   */
  function getBlobArray() {
    return blobArray;
  }

  /**
   * @name updateBlobArray
   *
   * @memberof $Worker
   *
   * @param {*} val - the item to add to the blobd
   */
  function updateBlobArray(val) {
    blobArray.push(val);
  }
}

/**
 * @name postMessage
 *
 * @memberof $Worker
 *
 * @description
 * run the created web worker. either post the message to the thread OR return the result of of fallback to the onmessage method
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
      worker.onmessage(worker.errorHandler('0001'));
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
 *
 * @description
 * load named functions into the web worker to be used by the web worker
 */
$Worker.prototype.loadScripts = function loadScripts() {
  var worker = this;

  for(var i = 0, len = arguments.length; i < len; i++) {
    worker.updateBlobArray(arguments[i]);
  }

  if(worker.hasWorkers) {
    worker.blob = new Blob(worker.getBlobArray(), { type: "text/javascript"});

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }
};