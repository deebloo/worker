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
 */
function $worker() {
  var _workers = [];

  var _worker = {
    // The actual web worker
    shell: {},

    // The array to be used to create a blob
    blobArray: [],

    /**
     * post data to the worker
     *
     * @param {string|number|object|array} data
     *
     * @return {_worker}
     */
    run: function (data) {
      _postMessage(this, data);

      return this;
    },

    /**
     * web worker success callback. maps to the onmessage method.
     *
     * @param {function} fn - the function to call when the worker finishes
     *
     * @return {_worker}
     */
    success: function (fn) {
      this.shell.onmessage = fn;

      return this;
    },

    /**
     * web worker error callback.
     *
     * @param {function} fn the function to call when the worker errors
     *
     * @return {_worker}
     */
    error: function (fn) {
      this.shell.onerror = fn;

      return this;
    },

    /**
     * terminates the worker and removes it from the list of workers
     */
    terminate: function () {
      _workers.splice(_workers.indexOf(this), 1);

      this.shell.terminate();
    },

    /**
     * injects an object and assigns those values to the worker scope. rebuilds the worker
     *
     * @param {object} scripts - scripts to be loaded
     *
     * @return {_worker}
     */
    loadScripts: function (scripts) {
      var key, val;

      for (var name in scripts) {
        if (scripts.hasOwnProperty(name)) {
          key = name;
          val = scripts[name];

          this.blobArray.unshift(';');
          this.blobArray.unshift(val.toString());
          this.blobArray.unshift(_makeVarName(key));
        }
      }

      _createWebWorker(this);

      return this;
    },

    /**
     * Removes scripts from the worker. rebuilds the worker
     *
     * @return {_worker}
     */
    removeScripts: function () {
      var index;

      for (var i = 0, len = arguments.length; i < len; i++) {
        index = this.blobArray.indexOf(_makeVarName(arguments[i]));

        this.blobArray.splice(index, 3);
      }

      _createWebWorker(this);

      return this;
    }
  };

  /**
   * Creates the actual web worker
   *
   * @param {object} obj - the $worker object created from _workerProto
   *
   * @private
   */
  function _createWebWorker(obj) {
    obj.blob = new Blob(obj.blobArray, {type: 'text/javascript'});

    obj.shell = new Worker(window.URL.createObjectURL(obj.blob));
  }

  /**
   * defines how a variable is defined in the web worker
   *
   * @param {string} name - the variable name
   *
   * @return {string}
   *
   * @private
   */
  function _makeVarName(name) {
    return 'self.' + name + ' = ';
  }

  /**
   * Extends an object
   *
   * @param {object} target - the object to be added to
   * @param {object} src - the object to add to the target
   *
   * @return {object} - returns the target with the src properties added
   *
   * @private
   */
  function _extend(target, src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        target[key] = src[key]
      }
    }

    return target;
  }

  /**
   * sends the message data to the web worker
   *
   * @param {object} worker - the web worker to act on
   * @param {string|number|object|array} data - the data to send to the worker
   *
   * @private
   */
  function _postMessage(worker, data) {
    data = data || {};

    var postMessageData = _extend({
      _src: window.location.protocol + '//' + window.location.host
    }, data);

    worker.shell.postMessage(postMessageData);
  }

  return {
    create: function (method) {
      var obj = Object.create(_worker);

      obj.blobArray = ['self.onmessage = ', method.toString(), ';'];

      _createWebWorker(obj);

      _workers.push(obj);

      return obj;
    },

    success: function (fn) {
      _workers.forEach(function (current) {
        current.shell.onmessage = fn;
      });

      return this;
    },

    error: function (fn) {
      _workers.forEach(function (current) {
        current.shell.onerror = fn;
      });

      return this;
    },

    extend: function (obj) {
      _extend(_worker, obj);

      return this;
    },

    run: function (data) {
      _workers.forEach(function (current) {
        _postMessage(current, data);
      });

      return this;
    },

    terminate: function () {
      _workers.forEach(function (current) {
        current.shell.terminate();
      });

      _workers.length = 0;

      return this;
    },

    list: function() {
      return _workers;
    }
  }
}