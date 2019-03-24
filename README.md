# Express Render Error

Set up an express server with error handlers, signal handlers and common environment variable support.

**To understand how this fits into the bigger picture of structuring Express apps in this style, please read the [FAQ](https://github.com/thejimmyg/express-render-error/blob/master/FAQ.md) first.**


## Configuration

The components in this pacakge make use of the `app.locals.debug` and `app.locals.option` namespaces.

## Common Options from Environment Variables

Typical usage:

```
const { prepareErrorHandlers, prepareDebug, prepareOption, optionFromEnv, installSignalHandlers, setupErrorHandlers } = require('express-render-error')
const debug = require('debug')('express-render-error:server')
const { prepareMustache, setupMustache, mustacheFromEnv } = require('express-mustache-overlays')

installSignalHandlers()

const app = express()
prepareDebug(app, debug)
prepareOption(app, optionFromEnv(app))
prepareMustache(app, mustacheFromEnv(app))
prepareErrorHandlers(app)

// Add route handlers here

// Call setupPublicFiles() here if you are using express-public-files-overlays

// Handle errors afterwards
setupErrorHandlers(app, { debug })

// Set up the mustache engine that the error handlers will use for rendering
const mustacheEngine = setupMustache(app)
app.engine('mustache', mustacheEngine)
app.set('views', app.locals.mustache.dirs)
app.set('view engine', 'mustache')

// Listen and serve
app.listen(app.locals.option.port, () => console.log(`Example app listening on port ${app.locals.option.port}`))
```

**Caution: If you are using express-public-files-overlays make sure that your call to `setupPublic()` comes *before* the call to `setupErrorHandlers()` otherwise your 404 handler will handle static files instead of the static file server.**

This will set `scriptName`, `sharedPublicUrlPath`, `title` (not `defaultTitle`) and `port` on `app.locals`. By default, any render engines registered with Express will use the values in `app.locals` if a the variable can't be found in `res.locals` or in the data passed directory to the `res.render()` all.

Here are the variables that are parsed with
* `SCRIPT_NAME` - The URL path component where the app that uses this is located. Defaults to `''` to mean the root URL of the functionality being mounted. Accessed as `scriptName` in the return value. For example sign in functionality might be mounted with a script name of `/user`. Should not end in a `/`
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

There is a small demo in the `./example` directory.


## Dev

```
npm run fix
```


## Changelog

### 0.1.4 2019-02-15

* Added `FAQ.md`
* Removed unnecessary extra licensing

### 0.1.3 2019-02-09

* Added titles to the pages

### 0.1.2 2019-02-09

* Improved Docker example

### 0.1.1 2019-02-07

* Added `prepareDebug`, `prepareOption`, `prepareErrorHandlers`
* Refactored example in to the `./example` directory
* Use `top` and `bottom` templates

### 0.1.0 2019-02-06

* First version
