# worker

A tiny micro library to help make using web workers easier. Spins up an inline web worker for you with the option of adding a fallback method in case creating the worker fails. The API for interacting with a web worker remains exactly the same, it is just the creation that is more abstracted.

For more info on web workers look [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

### Install

```
bower install --save worker
```

### Basic Usage

```JS
var myWorker = new $Worker(function(e) {
  var sum = 0;
  
  e.data.forEach(function(int) {
    sum += int;
  });
  
  self.postMessage(sum);
});

myWorker.onmessage = function(data) {
  console.log(data);
};

myWorker.postMessage([1,2,3,4,5]);
```

### API

#### $Worker
Constructor - creates a new web worker

| Arg     | Type    | description |
| --------|---------|-------|
| func  | Function   | the code to be used in the web worker    |
| fb | Function | the fallback function to use in case of webworker creation failure    |

Example:
```JS
var myWorker = new $Worker(function(e) {
  var sum = 0;
  
  e.data.forEach(function(int) {
    sum += int;
  });
  
  self.postMessage(sum);
});
```

#### $Worker.postMessage
Post data for the web worker to use. Runs the web worker

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data to be posted (cannot be function)  |

Example:
```JS
myWorker.postMessage([1,2,3,4,5]);
```

#### $Worker.onmessage
Override this method. This method is called whenever your $worker posts data back.

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data that is posted back from the worker|

Example:
```JS
myWorker.onmessage = function(data) {
  console.log(data);
};
```

#### $Worker.loadScripts
Sometimes you need to load functions into your worker. $worker.loadScripts loads a list of functions into the web worker that can be used by the worker

| Arg     | Type    | description |
| --------|---------|-------|
| *  | Object | A map of functions and the name they should be stored under  |

```JS
myWorker.loadScripts({'hello', hello}, {'goodbye': goodbye});

function hello() {
  console.log('Hello World');
}

function goodbye() {
  console.log('Goodbye World');
}
```

#### $Worker.removeScripts
Remove injected scripts from the web worker

| Arg     | Type    | description |
| --------|---------|-------|
| *  | String | A list of function names to be removed.  |

```JS
myWorker.removeScripts('hello', 'goodbye');

function hello() {
  console.log('Hello World');
}

function goodbye() {
  console.log('Goodbye World');
}
```


### Complete Example
```JS
var myWorker = new $Worker(function(e) {
  var foo = [], min = e.data.min, max = e.data.max;
  
  for (var i = 0; i < e.data.length; i++) {
    foo.push(Math.floor(Math.random() * (max - min)) + min);
  }
  
  // function passed in from the loadScripts api
  hello();

  self.postMessage(foo);
});

myWorker.loadScripts(function hello() { console.log('hello world'); });

myWorker.onmessage = function(data) {
  result = data;
};

myWorker.postMessage({length: 1024, min: 0, max: 9999});
```



