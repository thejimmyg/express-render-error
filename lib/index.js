const debug = require('debug')('express-render-error')
const path = require('path')

const optionFromEnv = (app) => {
  const options = {}
  if (typeof process.env.SCRIPT_NAME !== 'undefined') {
    options.scriptName = process.env.SCRIPT_NAME
  }
  if (typeof process.env.PORT !== 'undefined') {
    options.port = process.env.PORT
  }
  if (typeof process.env.SHARED_PUBLIC_URL_PATH !== 'undefined') {
    options.sharedPublicUrlPath = process.env.SHARED_PUBLIC_URL_PATH
  }
  if (typeof process.env.DEFAULT_TITLE !== 'undefined') {
    options.defaultTitle = process.env.DEFAULT_TITLE
  }
  return options
}

const prepareOption = (app, option) => {
  if (!app.locals.option) {
    app.locals.option = {}
  }
  Object.assign(app.locals.option, { scriptName: '', port: 80, sharedPublicUrlPath: (option.scriptName || '') + '/public', defaultTitle: '(no title)' }, option)
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
    res.render('404', { title: 'Not Found' })
  })

  // Error handler has to be last
  app.use((err, req, res, next) => {
    app.locals.debug(app.locals.option)
    app.locals.debug(err)
    res.status(500)
    try {
      res.render('500', { title: 'Internal Server Error' })
    } catch (e) {
      debug('Error during rendering 500 page:', e)
      app.locals.debug('Error during rendering 500 page:', e)
      res.send('Internal server error.')
    }
  })
}

module.exports = { prepareDebug, optionFromEnv, installSignalHandlers, setupErrorHandlers, prepareOption, prepareErrorHandlers }
