/**
 * @name $worker
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
 * filter.postMessage([ ... ])
 *
 * @returns {{create: Function, extend: Function, postMessage: Function, terminate: Function, list: Function}}
 */
function $worker() {

  var urlBuilder = window.URL.createObjectURL,
      workers = [];

  /**
   * @name proto
   *
   * @type {{postMessage: $worker._postMessage, onmessage: Function, onerror: Function, terminate: Function, loadScripts: Function, removeScripts: Function}}
   */
  var proto = {
    /* reference postMessage */
    postMessage: _postMessage,

    /* override to listen for message */
    onmessage: function() {},

    /* override to listen for error */
    onerror: function() {},

    /**
     * @name terminate
     *
     * @memberof proto
     *
     * @description
     * terminate the worker. (all stop does not finish or allow cleanup)
     *
     * @example
     * myWorker.terminate();
     */
    terminate: function terminate() {
      workers.splice(workers.indexOf(this), 1); // remove the worker for the list

      this.shell.terminate(); // terminate the actual worker
    },

    /**
     * @name loadScripts
     *
     * @memberof proto
     *
     * @description
     * Allows the loading of scripts into the worker for use.
     * NOTE: this will rebuild the worker. should not be done while the worker is running
     *
     * @example
     * myWorker.loadScripts({
     *   hello: function() { return 'hello'; },
     *   world: function() { return 'world' }
     * })
     */
    loadScripts: function loadScripts(scripts) {
      var key, val;

      for(var name in scripts) {
        if(scripts.hasOwnProperty(name)) {
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
     * @name removeScripts
     *
     * @memberof proto
     *
     * @description
     * remove scripts that have been loaded into the worker.
     * NOTE: this will rebuild the worker. should not be done while the worker is running
     *
     * @example
     * myWorker.removeScripts('hello', 'world');
     */
    removeScripts: function removeScripts() {
      var index;

      for(var i = 0, len = arguments.length; i < len; i++) {
        index = this.blobArray.indexOf(__makeVarName(arguments[i]));

        this.blobArray.splice(index, 3);
      }

      __createWebWorker.call(this);
    }
  };

  /**
   * @name create
   *
   * @memberof $worker
   *
   * @param method
   *
   * @example
   * var myWorker = $worker.create(function(e.data) {
   *   self.postMessage(e.data + 1);
   * });
   *
   * @public
   */
  function create(method) {
    var obj = Object.create(proto);

    obj.blobArray = ['self.onmessage = ', method.toString(), ';']; // array to be used for blob

    __createWebWorker.call(obj);

    workers.push(obj);

    return obj;
  }

  /**
   * @name extend
   *
   * @memberof $worker
   *
   * @description
   * Extend the base prototype. Properties will be inherited by ALL currently created and new workers. The base prototype methods cannot be overridden.
   *
   * @example
   * $worker.extend({
   *   newProp1: function() {
   *     return 'I am a new prototype property'
   *   },
   *   newProp2: 'We are workers'
   * });
   *
   * @public
   */
  function extend(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        proto[key] = obj[key]
      }
    }

    return this;
  }

  /**
   * @name postMessage
   *
   * @memberof $worker
   *
   * @description
   * post data to ALL of the workers belonging to this instance
   *
   * @param data
   */
  function postMessage(data) {
    for(var i = 0, len = workers.length; i < len; i++) {
      _postMessage.call(workers[i], data);
    }

    return this;
  }

  /**
   * @name terminate
   *
   * @memberof $worker
   *
   * @description
   * terminate all workers
   */
  function terminate() {
    for(var i = 0, len = workers.length; i < len; i++) {
      workers[i].shell.terminate();
    }

    workers.length = 0;

    return this;
  }

  /**
   * @name list
   *
   * @memberof $worker
   * 
   * @description
   * return the current list of active workers
   */
  function list() {
    return workers;
  }

  /**
   * @name postMessage
   *
   * @memberof $worker
   *
   * @description
   * send data tp the worker and assign the onmessage and on error listeners
   *
   * @example
   * myWorker.postMessage(1988);
   *
   * @param {*} data
   *
   * @protected
   */
  function _postMessage(data) {
    this.shell.postMessage(data);

    this.shell.onmessage = this.onmessage;

    this.shell.onerror = this.onerror;
  }

  /**
   * @name __createWebWorker
   *
   * @memberof $worker
   *
   * @private
   */
  function __createWebWorker() {
    this.blob = new Blob(this.blobArray, { type: 'text/javascript' });

    this.shell = new Worker(urlBuilder(this.blob));
  }

  /**
   * @name __makeVarName
   *
   * @memberof $worker
   *
   * @param name
   *
   * @return {string}
   *
   * @private
   */
  function __makeVarName(name) {
    return 'self.' + name + ' = ';
  }

  /* Expose public methods */
  return {
    create: create,
    extend: extend,
    postMessage: postMessage,
    terminate: terminate,
    list: list
  }

}