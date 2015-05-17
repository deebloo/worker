/**
 * @name $Worker
 *
 * @param {Function} method - the web worker code to be run
 * @param {Function} [fb] - the fallback method to use if the web worker fails
 * @param {Boolean} [debug] - manually set the workers to fallback
 *
 * @description
 * spin up an embedded web worker.
 *
 * @constructor
 */
function $Worker(method, fb, debug) {
  var worker = this;

  var blobArray = ['self.onmessage = ', method, ';']; // array to be used for blob

  worker.hasWorkers = debug ? false : !!window.Worker; // does the browser have workers
  worker.blob = null; // blob container
  worker.shell = null; // shell container
  worker.fb = fb;

  if(worker.hasWorkers) {
    worker.blob = new Blob(blobArray, { type: "text/javascript" });

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }

  /**
   * @name getBlobArray
   *
   * @memberof $Worker
   *
   * @return {Array}
   */
  worker.getBlobArray = function getBlobArray() {
    return blobArray;
  };

  /**
   * @name updateBlobArray
   *
   * @memberof $Worker
   *
   * @param {*} val - the item to add to the blobd
   */
  worker.updateBlobArray = function updateBlobArray(val) {
    blobArray.unshift(val);
  };

  /**
   * @name updateBlobArray
   *
   * @memberof $Worker
   *
   * @param {Number} idx - index to start at
   * @param {Number} length - the number of items to remove
   */
  worker.removeFromBlobArray = function removeFromBlobArray(idx, length) {
    blobArray.splice(idx, length);
  };
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

    worker.shell.onerror = worker.onerror;
  }
  else {
    if(typeof worker.fb === 'function') {
      worker.onmessage(worker.fb({data: data}));
    }
    else {
      worker.onmessage(worker.error('0001'));
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
 * @name onerror
 *
 * @memberof $Worker
 *
 * @description
 * override this method to when listening for worker errors
 */
$Worker.prototype.onerror = function onerror() {
  console.error(this.error('0002'));
};

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
  var worker = this, current, currentMethod, key;

  for(var i = 0, len = arguments.length; i < len; i++) {
    current = arguments[i];

    key = Object.keys(current)[0];

    currentMethod = current[key];

    worker.updateBlobArray(';');
    worker.updateBlobArray(currentMethod);
    worker.updateBlobArray('var ' + key + ' = ');
  }

  if(worker.hasWorkers) {
    worker.blob = new Blob(worker.getBlobArray(), { type: "text/javascript"});

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }
};

/**
 * @name removeScripts
 *
 * @memberof $Worker
 *
 * @description
 * remove a previously loaded function from the worker
 */
$Worker.prototype.removeScripts = function removeScripts() {
  var worker = this, array = worker.getBlobArray(), index;

  for(var i = 0, len = arguments.length; i < len; i++) {
    index = array.indexOf('var ' + arguments[i] + ' = ');

    worker.removeFromBlobArray(index, 3);
  }

  if(worker.hasWorkers) {
    worker.blob = new Blob(worker.getBlobArray(), { type: "text/javascript"});

    worker.shell = new Worker(window.URL.createObjectURL(worker.blob));
  }
};

/**
 * @name error
 *
 * @memberof $Worker
 *
 * @param {String} code - the web worker code to be run
 */
$Worker.prototype.error = function error(code) {
  return {
    code: code,
    message: this.errors[code]
  };
};

/**
 * @name errors
 *
 * @memberof $Worker
 */
Object.defineProperty($Worker.prototype, 'errors', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: {
    '0001': 'web workers are not supported in your current browser and no fallback has been given',
    '0002': 'something went wrong with your worker'
  }
});