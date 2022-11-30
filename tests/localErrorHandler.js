function localErrorHandler(err, req, res, next) {
  console.log('inside local error handler')
  next(err)
}

module.exports = localErrorHandler
