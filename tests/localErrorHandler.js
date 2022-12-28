import log from '@samislam/log'

function localErrorHandler(err, req, res, next) {
  log.error('inside local error handler')
  log(err)
  // next()
}

export default localErrorHandler
