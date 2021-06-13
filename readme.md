# Go-Singleflight
Highly inspired by Golang singleflight class.

The Singleflight class would hold all function calls at the same time, execute only execute source function once then copy result to others.
                              
Singleflight has these feature 
1. call async / sync function / handle exception as usual
2. 100% test coverage

## Sample Code
```js
import SingleFlight from 'go-singleflight';

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
Source function would only run `once`.

### Using in express server
It would be useful to prevent multiple db query when cache invalidate, known as cache penetration.

See the full example in `./example/express-server`
```js 
// initial once and pass down by middleware
const singleFlight = new SingleFlight();
app.use((req, res, next) => {
	req.singleFlight = singleFlight
	next();
});

app.get('/test-singleflight', async (req, res) => {
	const key = 'test';
	let value = await readFromCache(key);
	if (!value) {
		try {
			const protectFn = req.singleFlight.do(key, readFromDb);
			value = await protectFn(key);
		}catch (e) {
			console.error(e)
		}
		await setCache(key, value);
	}
	
	return res.json({
		value
	});
});
```

### Forget
Sometimes you would like to forget before the first one function finished, due to some timeout mechanism.  
You could call forget to let source function execute.
> The protect function run before forget would get the previous result

```js 
import SingleFlight from 'go-singleflight';

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