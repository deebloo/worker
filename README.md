# worker

A tiny micro library to help make using web workers easier.

NOTE: I may use ES2015 features such as arrow function for brevities sake

For more info on web workers look [here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

### Install

```
bower install --save worker
```

### Basic Usage

```JS
$worker()
  .create((e) => {
    var sum = 0;
    
    e.data.forEach(function(int) {
      sum += int;
    });
    
    self.postMessage(sum);
  })
  .success(data => console.log(data))
  .error(err => console.error(err))
  .run([1,2,3,4,5]);
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
var myWorker = $worker().create(e => {
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

#### $worker().create().run()
Post data for the web worker to use. Runs the web worker

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data to be posted (cannot be function)  |

Example:
```JS
$worker()
  .create(e => self.postMessage(e.data))
  .run([ ...somedata]);
```

#### $worker().create().success()
Override this method. This method is called whenever your $worker posts data back.

| Arg     | Type    | description |
| --------|---------|-------|
| data  | * | the data that is posted back from the worker|

Example:
```JS
$worker()
  .create(e => self.postMessage(e.data))
  .success(res => console.log(res.data))
  .run([ ...somedata]);
```

#### $worker().create().loadScripts()
Sometimes you need to load functions into your worker. $worker.loadScripts loads a list of functions into the web worker that can be used by the worker. 

NOTE: anything other then functions should be passed in with postMessage 

| Arg     | Type    | description |
| --------|---------|-------|
| *  | Object | A map of functions and the name they should be stored under  |

```JS

$worker().create(() => {
  var hello = hello();
  var goodbye = goodbye();
})
.loadScripts({
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
// A group of web workers
var group = $worker();

var myWorker = group.create(e => {
  var foo = [], min = e.data.min, max = e.data.max;
  
  e.data.length.forEach(() => foo.push(Math.floor(Math.random()*(max-min))+min));
  self.hello();
  self.postMessage(foo);
})
.loadScripts({
  'hello': () => console.log('yay')
})
.success(res => results = res.data)
.error(err => throw new Error());

myWorker.postMessage({length: 1024, min: 0, max: 9999});
```



