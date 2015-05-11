# worker

A tiny micro library to help make using web workers easier. Spins up an inline web worker for you with the option of adding a fallback method in case creating the worker fails. The API for interacting with a web worker remains exactly the same, it is just the creation that is more abstracted.

For more info on web workers look [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

### Install

```
bower install --save worker
```

### Basic Usage

```JS
var myWorker = $worker(function(e) {
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

#### $worker
factory - creates a new web worker

| Arg     | Type    | desctiption |
| --------|---------|-------|
| func  | Function   | the code to be used in the web worker    |
| fb | Function | the fallback function to use in case of webworker creation failure    |

Example:
```JS
var myWorker = $worker(function(e) {
  var sum = 0;
  
  e.data.forEach(function(int) {
    sum += int;
  });
  
  self.postMessage(sum);
});
```

#### $worker.postMessage
Post data for the web worker to use. Runs the web worker

| Arg     | Type    | desctiption |
| --------|---------|-------|
| data  | * | the data to be posted (cannot be function)  |

Example:
```JS
myWorker.postMessage([1,2,3,4,5]);
```

#### $worker.onmessage
Override this method. This method is called whenever your $worker posts data back.

| Arg     | Type    | desctiption |
| --------|---------|-------|
| data  | * | the data that is posted back from the worker|

Example:
```JS
myWorker.onmessage = function(data) {
  console.log(data);
};
```

#### $worker.loadScripts
Sometimes you need to load functions into your worker. $worker.loadScripts loads a list of NAMED function declarations into the web worker that can be used by the worker

| Arg     | Type    | desctiption |
| --------|---------|-------|
| data  | * | the data to be posted (cannot be function)  |

```JS
myWorker.loadScripts(function hello() { console.log('hello world'); }, );

function hello() {
  console.log('Hello World');
}

function goodbye() {
  console.log('Goodbye World');
}
```



