# Express server example
Show the go-singleflight potential usage in express server. Protect the cache penetration

## how to run example
1. `$npm install`
2. `$docker compose up`: would start mysql and redis
3. `$node server.js`
4. `$ab -n 5 -c 5 -v 4 http://localhost:3001/test-singleflight`: use ab to test
5. compare to `$ab -n 5 -c 5 -v 4 http://localhost:3001/test` without protection