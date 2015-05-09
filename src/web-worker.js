/**
 * @name $worker
 *
 * @param {Function} method
 * @param {Function} [fb]
 *
 * @description
 * spin up an inline web worker.
 *
 * @return {{run: *, onmessage: *}}
 */
function $worker(method, fb) {
  // Create blob from the passed in function
  var blob = new Blob(['self.onmessage = ' + method.toString()], {
    type: "text/javascript"
  });

  // Create new web worker. This worker will be referred to as 'shell' from now on
  var shell = new Worker(window.URL.createObjectURL(blob));

  return {
    _method     : method,
    _shell      : shell,
    postMessage : postMessage,
    onmessage   : onmessage,
    terminate   : terminate
  };

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
  function postMessage(data) {
    var worker = this;

    if(!!window.Worker) {
      window.URL = window.URL || window.webkitURL;

      worker._shell.postMessage(data);

      worker._shell.onmessage = function(res) {
        worker.onmessage(res.data);
      };
    }
    else {
      if(typeof fb !== 'function') {
        fb(data);
      }
      else {
        throw 'web workers are not supported in your current browser';
      }
    }
  }

  /**
   * @name onmessage
   *
   * @memberof $worker
   *
   * @description
   * override this method to when listening for the worker to complete
   */
  function onmessage() { }

  /**
   * @name terminate
   *
   * @memberof $worker
   *
   * @description
   * terminate the created web worker
   */
  function terminate() {
    var worker = this;

    worker._shell.terminate();
  }
}