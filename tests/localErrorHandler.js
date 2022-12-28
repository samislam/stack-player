const log = require('@samislam/log')

function localErrorHandler(err, req, res, next) {
  log.error('inside local error handler')
  log(err)
  // next()
}

module.exports = localErrorHandler
