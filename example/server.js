const express = require('express')
const { prepareErrorHandlers, prepareDebug, prepareOption, optionFromEnv, installSignalHandlers, setupErrorHandlers } = require('express-render-error')
const debug = require('debug')('express-render-error:server')
const { prepareMustache, setupMustache, mustacheFromEnv } = require('express-mustache-overlays')

installSignalHandlers()

const app = express()
prepareDebug(app, debug)
prepareOption(app, optionFromEnv(app))
prepareMustache(app, mustacheFromEnv(app))
prepareErrorHandlers(app)

// Add any routes here:
app.get('/throw', (req, res) => {
  throw new Error('Test Error')
})

// Error handlers
setupErrorHandlers(app)

// Set up the mustache engine that the error handlers will use for rendering
const mustacheEngine = setupMustache(app)
app.engine('mustache', mustacheEngine)
app.set('views', app.locals.mustache.dirs)
app.set('view engine', 'mustache')

// Listen and serve
app.listen(8000, () => console.log(`Example app listening on port 8000`))
