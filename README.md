# worker [![CircleCI](https://circleci.com/gh/deebloo/worker.svg?style=svg)](https://circleci.com/gh/deebloo/worker)

A tiny library to help make using web workers easier.

For more info on web workers look [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

### Install

```
npm i worker --save
```

#### Support
Chome, Firefox, Safari, and IE11+

### Basic Usage

```JS
var myWorker = $worker().create(function () {
    self.postMessage('Hello World');
});

myWorker.run().then(function (e) {
    console.log(e.data); // 'Hello World'
});
```

### API

#### $worker
factory - creates instance of $worker that can then be used to create web workers

Example:
```JS
var worker = $worker();
```

#### $worker().create()
creates a new web worker

| Arg     | Type     | description                         |
| --------|----------|-------------------------------------|
| fn      | Function | the function to run in a web worker |

Example:
```JS
function helloWorld() {
    self.postMessage('Hello World');
}

var myWorker = $worker().create(helloWorld);
```

#### $worker().create().run()
Post data for the web worker to use. Runs the web worker and returns a promise;

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data to be posted (cannot be function)  |

Example:
```JS
$worker()
  .create(function (e) {
      self.postMessage(e.data.toUpperCase());
  })
  .run('hello world')
  .then(function (e) {
      console.log(e.data) // HELLO WORLD
  });
```

#### $worker().list()
Returns a list of all of the created workers

Example:
```JS
var workerGroup = $worker();

workerGroup.create( ... );
workerGroup.create( ... );

workerGroup.list().length === 2
```