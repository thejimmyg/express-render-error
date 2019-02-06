# Express Render Error

Set up an express server with error handlers, signal handlers and common environment variable support.

## Common Options from Environment Variables

Typical usage:

```
const {optionsFromEnv} = require('express-render-error')
const options = optionsFromEnv()
app.locals = Object.assign({}, app.locals, options)
```

This will set `scriptName`, `sharedPublicUrlPath`, `title` (not `defaultTitle`) and `port` on `app.locals`. By default, any render engines registered with Express will use the values in `app.locals` if a the variable can't be found in `res.locals` or in the data passed directory to the `res.render()` all.

Here are the variables that are parsed with 
* `SCRIPT_NAME` - The URL path where the app that uses this is located. Defaults to `''` to mean the root URL of the domain. Accessed as `scriptName` in the return value.
* `SHARED_PUBLIC_URL_PATH` - the full URL path that a template should use to point to a location that serves static files. The public files will be expected to be served from `${SCRIPT_NAME}/public` by default. Accessed as `sharedPublicUrlPath` in the return value. (This package doesn't handle the actual serving, see express-public-files-overlays for one solution to that.)
* `DEFAULT_TITLE` - the default title to use for pages. Accessed as `title` in the return value, not `defaultTitle`.
* `PORT` - Defaults to 80, but set it to something like 8000 if you want to run without needing `sudo`. Accessed as `port` in the return value.

If you are using the `debug` package, remember that you can always set `DEBUG` which the package will parse itself.

## Signal Handling

Docker Compose sends a `SIGTERM` signal 10 seconds before `SIGINT` when stopping or restarting containers. By exiting on a `SIGTERM` signal you can have faster restarts.

You can regiser these signal handlers at any point in a script like this. Often it is convenient to do this fairly early though:

```
const {installSignalHandlers} = require('express-render-error')
installSignalHandlers()
```

## Error Handling

If you are using a view engine and have set up templates named `404` and `500` then you can install error handlers with `setupErrorHandlers(...)` to take care of rendering those pages for you.

The first argument should be the express app.

**Make sure `app.locals.debug` is set, as the error handler uses this to log errors.**

Here's an example:

```
const express = require('express')
const debug = require('debug')('my-app')
const {setupErrorHandlers} = require('express-render-error')
app = express()
app.locals.debug = debug
// Right at the end, after all middleware, routers and handlers
setupErrorHandlers(app)
app.listen(8000, () => console.log(`Example app listening on port 8000`))
```

You can find suitable 404 and 500 views in `bootstrap-flexbox-overlay` which is used with `express-mustache-overlays`.


## Example

There is a small demo (including setting up of a template engine) that you can run with:

```
DEBUG="express-render-error:server" npm start
```

If you visit http://localhost:8000 you should see the 404 page since there are no handles for that path. If you visit http://localhost:8000/throw an error will be thrown which the error handler will catch, log to the debug logger (make sure `DEBUG` is set correctly to see it) and then display a 500 error page for.

Try setting `DEFAULT_TITLE` to change the title.

## Dev

```
npm run fix
```


## Changelog

### 0.1.0 2019-02-06

* First version