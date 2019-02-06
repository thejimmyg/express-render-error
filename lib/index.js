const optionsFromEnv = () => {
  const scriptName = process.env.SCRIPT_NAME || ''
  const port = process.env.PORT || 80
  const sharedPublicUrlPath = process.env.SHARED_PUBLIC_URL_PATH || scriptName + '/public'
  const title = process.env.DEFAULT_TITLE || '(no title)'
  return { scriptName, port, sharedPublicUrlPath, title }
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
      app.locals.debug('Error during rendering 500 page:', e)
      res.send('Internal server error.')
    }
  })
}

module.exports = { optionsFromEnv, installSignalHandlers, setupErrorHandlers }
