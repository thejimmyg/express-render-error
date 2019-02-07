const debug = require('debug')('express-render-error')
const path = require('path')

const optionFromEnv = (app) => {
  const scriptName = process.env.SCRIPT_NAME || ''
  const port = process.env.PORT || 80
  const sharedPublicUrlPath = process.env.SHARED_PUBLIC_URL_PATH || scriptName + '/public'
  const title = process.env.DEFAULT_TITLE || '(no title)'
  return { scriptName, port, sharedPublicUrlPath, title }
}

const prepareOption = (app, option) => {
  if (!app.locals.option) {
    app.locals.option = {}
  }
  Object.assign(app.locals.option, option)
}

const installSignalHandlers = () => {
  // Better handling of SIGINT and SIGTERM for docker
  process.on('SIGINT', function () {
    console.log('Received SIGINT. Exiting ...')
    process.exit()
  })

  process.on('SIGTERM', function () {
    console.log('Received SIGTERM. Exiting ...')
    process.exit()
  })
}

const prepareDebug = (app, debug) => {
  app.locals.debug = debug
}

const prepareErrorHandlers = (app) => {
  app.locals.mustache.overlay([path.join(__dirname, '..', 'views')])
}

const setupErrorHandlers = (app) => {
  // Must be after other routes - Handle 404
  app.get('*', (req, res) => {
    res.status(404)
    res.render('404')
  })

  // Error handler has to be last
  app.use((err, req, res, next) => {
    app.locals.debug(err)
    res.status(500)
    try {
      res.render('500')
    } catch (e) {
      debug('Error during rendering 500 page:', e)
      app.locals.debug('Error during rendering 500 page:', e)
      res.send('Internal server error.')
    }
  })
}

module.exports = { prepareDebug, optionFromEnv, installSignalHandlers, setupErrorHandlers, prepareOption, prepareErrorHandlers }
