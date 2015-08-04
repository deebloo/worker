/**
 * @namespace $worker
 *
 * @author Danny Blue
 *
 * @license MIT
 *
 * @description
 * A small micro library for assisting with the creation of web workers. No need for separate scripts for the worker itself and
 * no separate file for scripts you want to include in the worker. Have 15 workers defined and you want to change a property on all of them?
 * No problem. All workers inherit from the same object so you can make changes across the board
 *
 * @returns {{create: Function, extend: Function, postMessage: Function, terminate: Function, list: Function}}
 */
function $worker() {

  /* @private */
  var __urlBuilder = (function () {
    try {
      return window.URL.createObjectURL;
    }
    catch (e) {
      throw new Error(e);
    }
  })();

  /* @protected */
  var _workers = [];

  /**
   * The prototype object to be used when creating a new worker
   *
   * @type {{postMessage: $worker._postMessage, onmessage: Function, onerror: Function, terminate: Function, loadScripts: Function, removeScripts: Function}}
   *
   * @private
   */
  var __proto = {
    /* reference postMessage */
    postMessage: _postMessage,

    /* override to listen for message */
    onmessage: function () {
    },

    /* override to listen for error */
    onerror: function () {
    },

    /**
     * terminate the worker. (all stop does not finish or allow cleanup)
     *
     * @memberof __proto
     *
     * @example
     * myWorker.terminate();
     */
    terminate: function terminate() {
      _workers.splice(_workers.indexOf(this), 1); // remove the worker for the list

      this.shell.terminate(); // terminate the actual worker
    },

    /**
     * Allows the loading of scripts into the worker for use.
     * NOTE: this will rebuild the worker. should not be done while the worker is running
     *
     * @memberof __proto
     *
     * @example
     * myWorker.loadScripts({
     *   hello: function() { return 'hello'; },
     *   world: function() { return 'world' }
     * });
     */
    loadScripts: function loadScripts(scripts) {
      var key, val;

      for (var name in scripts) {
        if (scripts.hasOwnProperty(name)) {
          key = name;
          val = scripts[name];

          this.blobArray.unshift(';');

          this.blobArray.unshift(val.toString());

          this.blobArray.unshift(__makeVarName(key));
        }
      }

      __createWebWorker.call(this);
    },

    /**
     * remove scripts that have been loaded into the worker.
     * NOTE: this will rebuild the worker. should not be done while the worker is running
     *
     * @memberof __proto
     *
     * @example
     * myWorker.removeScripts('hello', 'world');
     */
    removeScripts: function removeScripts() {
      var index;

      for (var i = 0, len = arguments.length; i < len; i++) {
        index = this.blobArray.indexOf(__makeVarName(arguments[i]));

        this.blobArray.splice(index, 3);
      }

      __createWebWorker.call(this);
    }
  };

  /**
   * @memberof $worker
   *
   * @param {Function} method - function containing your web worker code
   *
   * @example
   * var myWorker = $worker().create(function(e.data) {
   *   self.postMessage(e.data + 1);
   * });
   *
   * @public
   */
  function create(method) {
    var obj = Object.create(__proto);

    obj.blobArray = ['self.onmessage = ', method.toString(), ';']; // array to be used for blob

    __createWebWorker.call(obj);

    _workers.push(obj);

    return obj;
  }

  /**
   * Extend the base prototype. Properties will be inherited by ALL currently created and new workers. The base prototype methods cannot be overridden.
   *
   * @memberof $worker
   *
   * @param {Object} obj - the object add to the worker prototype
   *
   * @example
   * var myWorkers = $worker().extend({
   *   newProp1: function() {
   *     return 'I am a new __prototype property'
   *   },
   *   newProp2: 'We are workers'
   * });
   */
  function extend(obj) {
    __extend(__proto, obj);

    return this;
  }

  /**
   * post data to ALL of the workers belonging to this instance
   *
   * @memberof $worker
   *
   * @param {Object|String|Array|Number} data - the data to send to the web worker
   *
   * @example
   * $worker().postMessage({
   *   hello: 'world'
   * });
   */
  function postMessage(data) {
    for (var i = 0, len = _workers.length; i < len; i++) {
      _postMessage.call(_workers[i], data);
    }

    return this;
  }

  /**
   * terminate all workers
   *
   * @memberof $worker
   *
   * @example
   * $worker().terminate();
   */
  function terminate() {
    for (var i = 0, len = _workers.length; i < len; i++) {
      _workers[i].shell.terminate();
    }

    _workers.length = 0;

    return this;
  }

  /**
   * return the current list of active workers
   *
   * @memberof $worker
   *
   * @example
   * $worker().list();
   *
   * @returns {Array}
   */
  function list() {
    return _workers;
  }

  /**
   * send data tp the worker and assign the onmessage and on error listeners
   *
   * @memberof $worker
   *
   * @example
   * myWorker.postMessage(1988);
   *
   * @param {Object|String|Array|Number} data - the data to send to the web worker
   *
   * @protected
   */
  function _postMessage(data) {
    data = data || {};

    var postMessageData = __extend({
      _src: window.location.protocol + '//' + window.location.host
    }, data);

    this.shell.postMessage(postMessageData);

    this.shell.onmessage = this.onmessage;

    this.shell.onerror = this.onerror;
  }

  /**
   * @memberof $worker
   *
   * @private
   */
  function __createWebWorker() {
    this.blob = new Blob(this.blobArray, {type: 'text/javascript'});

    this.shell = new Worker(__urlBuilder(this.blob));
  }

  /**
   * Extend an object
   *
   * @memberof $worker
   *
   * @param {Object} target
   * @param {Object} src
   *
   * @private
   */
  function __extend(target, src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        target[key] = src[key]
      }
    }

    return target;
  }

  /**
   * @memberof $worker
   *
   * @param name
   *
   * @return {String}
   *
   * @private
   */
  function __makeVarName(name) {
    return 'self.' + name + ' = ';
  }

  /* Expose public methods */
  return {
    create     : create,
    extend     : extend,
    postMessage: postMessage,
    terminate  : terminate,
    list       : list
  };

}