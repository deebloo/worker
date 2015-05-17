/**
 * Create embedded web workers with a clean way to degrade gracefully for older browsers. (<=IE9)
 */
var $Worker = (function() {

  var errors = {
    '0001': 'web workers are not supported in your current browser and no fallback has been given',
    '0002': 'something went wrong with your worker'
  };

  var prototype = $Worker.prototype,
      createObjectURL = window.URL.createObjectURL,
      blobArray,
      blob,
      hasWorkers;

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

    blobArray = ['self.onmessage = ', method, ';']; // array to be used for blob
    hasWorkers = debug ? false : !!window.Worker; // does the browser have workers

    worker.shell = null; // shell container
    worker.fb = fb;

    if(hasWorkers) {
      blob = new Blob(blobArray, { type: 'text/javascript' });

      worker.shell = new Worker(createObjectURL(blob));
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
  prototype.postMessage = function postMessage(data) {
    var worker = this;

    if(hasWorkers) {
      worker.shell.postMessage(data);

      worker.shell.onmessage = function(res) {
        worker.onmessage(res.data);
      };

      worker.shell.on_error = worker.on_error;
    }
    else {
      if(typeof worker.fb === 'function') {
        worker.onmessage(worker.fb({ data: data }));
      }
      else {
        worker.onmessage(_error('0001'));
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
  prototype.onmessage = function onmessage() { };

  /**
   * @name on_error
   *
   * @memberof $Worker
   *
   * @description
   * override this method to when listening for worker _errors
   */
  $Worker.prototype.on_error = function on_error() {
    console._error(this._error('0002'));
  };

  /**
   * @name terminate
   *
   * @memberof $Worker
   *
   * @description
   * terminate the created web worker
   */
  prototype.terminate = function terminate() {
    var worker = this;

    if(hasWorkers) {
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
  prototype.loadScripts = function loadScripts() {
    var worker = this, current, currentMethod, key;

    for(var i = 0, len = arguments.length; i < len; i++) {
      current = arguments[i];

      key = Object.keys(current)[0];

      currentMethod = current[key];

      blobArray.unshift(';');
      blobArray.unshift(currentMethod);
      blobArray.unshift(_makeVarName(key));
    }

    if(hasWorkers) {
      blob = new Blob(blobArray, { type: 'text/javascript' });

      worker.shell = new Worker(createObjectURL(blob));
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
  prototype.removeScripts = function removeScripts() {
    var worker = this, index;

    for(var i = 0, len = arguments.length; i < len; i++) {
      index = blobArray.indexOf(_makeVarName(arguments[i]));

      blobArray.splice(index, 3);
    }

    if(hasWorkers) {
      blob = new Blob(blobArray, { type: 'text/javascript' });

      worker.shell = new Worker(createObjectURL(blob));
    }
  };

  /**
   * @name _makeVarName
   *
   * @param {String} name
   *
   * @return {string}
   *
   * @private
   */
  function _makeVarName(name) {
    return 'var ' + name + ' = ';
  }

  /**
   * @name _error
   *
   * @memberof $Worker
   *
   * @param {String} code - the web worker code to be run
   *
   * @private
   */
  function _error(code) {
    return {
      code: code,
      message: errors[code]
    };
  }

  return $Worker;

}());