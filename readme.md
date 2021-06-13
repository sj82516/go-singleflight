# Node-Singleflight
Highly inspired by Golang singleflight class.

The Singleflight class would hold all function calls at the same time, execute only execute source function once then copy result to others.
                              
Singleflight support
1. Handle promise
2. Throw out error

## Sample Code
```js
import SingleFlight from 'node-singleflight';

const key = "id-for-source-function"
const singleFlight = new SingleFlight()

const sourceFn = async function VeryExpensiveOperation(){
	...
}
// specify key and source function to protect
const protectFn = singleFlight.do(key, sourceFn)

// call as usual
const promiseList = []
promiseList.push(protectFn(args1, args2, ...))
promiseList.push(protectFn(args1, args2, ...))
promiseList.push(protectFn(args1, args2, ...))
promiseList.push(protectFn(args1, args2, ...))

await Promise.all(promiseList)
```
Source function would only run only `once`.

### Using in express server
It would be useful to prevent multiple db query when cache invalidate.
```js 
TBD
```

### Forget
Sometimes you would like to forget before the first one function finished, due to some timeout mechanism.  
You could call forget to let source function execute.
> The protect function run before forget would get the previous result

```js 
import SingleFlight from 'node-singleflight';

const key = "id-for-source-function"
const singleFlight = new SingleFlight()

const sourceFn = async function VeryExpensiveOperation(){
	...
}
// specify key and source function to protect
const protectFn = singleFlight.do(key, sourceFn)

// call as usual
await protectFn(args1, args2, ...)
```