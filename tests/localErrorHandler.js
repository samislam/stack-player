function localErrorHandler(err, req, res, next) {
  console.log('inside local error handler')
  next('some error')
}

module.exports = localErrorHandler
