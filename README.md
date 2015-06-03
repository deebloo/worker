# worker

A tiny micro library to help make using web workers easier.

For more info on web workers look [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

### Install

```
bower install --save worker
```

### Basic Usage

```JS
var myWorker = $worker().create(function(e) {
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
factory - creates instance of $worker that can then be used to create web workers

Example:
```JS
var worker = $worker();
```

#### $worker().create()
creates a new web worker

| Arg     | Type    | description |
| --------|---------|-------|
| func  | Function   | the code to be used in the web worker    |

Example:
```JS
var myWorker = $worker().create(function(e) {
  var sum = 0;
  
  e.data.forEach(function(int) {
    sum += int;
  });
  
  self.postMessage(sum);
});
```

#### $worker().extend()
extends that worker instances prototypes. Automatically updates all new and current worker objects.

Example:
```JS
var worker = $worker().extend({
  foo: true,
  bar: function() {
    return true;
  }
});

var myWorker = worker.create( ... );

myWorker.bar() === true
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

#### $worker().create().postMessage()
Post data for the web worker to use. Runs the web worker

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data to be posted (cannot be function)  |

Example:
```JS
var myWorker = $worker().create( ... );

myWorker.postMessage([ ...somedata... ]);
```

#### $worker().create().onmessage
Override this method. This method is called whenever your $worker posts data back.

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data that is posted back from the worker|

Example:
```JS
var myWorker = $worker().create( ... );

myWorker.onmessage = function(e) {
  console.log(e.data)
}
```

#### $worker().create().loadScripts()
Sometimes you need to load functions into your worker. $worker.loadScripts loads a list of functions into the web worker that can be used by the worker. 

NOTE: anything other then functions should be passed in with postMessage 

| Arg     | Type    | description |
| --------|---------|-------|
| *  | Object | A map of functions and the name they should be stored under  |

```JS
var myWorker = $worker().create(function() {
  var hello = hello();
  var goodbye = goodbye();
});

myWorker.loadScripts({
  hello: function() {
    return 'hello';
  }, 
  goodbye: function() {
    return 'goodbye';
  }
});
```

#### $worker().create().removeScripts()
Remove injected scripts from the web worker

| Arg     | Type    | description |
| --------|---------|-------|
| *  | String | A list of function names to be removed.  |

```JS
var myWorker = $worker().create( ... );

myWorker.removeScripts('hello', 'goodbye');
```


#### Complete Example
```JS
var group = $worker();

var myWorker = group.create(function(e) {
  var foo = [], min = e.data.min, max = e.data.max;
  
  for (var i = 0; i < e.data.length; i++) {
    foo.push(Math.floor(Math.random() * (max - min)) + min);
  }
  
  // function passed in from the loadScripts api
  hello();

  self.postMessage(foo);
});

myWorker.loadScripts({
  'hello': function hello() { console.log('yay')}
});

myWorker.onmessage = function(data) {
  result = data;
};

myWorker.postMessage({length: 1024, min: 0, max: 9999});
```



