module.exports = (errorHandler, fn) => (req, res, next) => {
  const catchIn = errorHandler ? errorHandler : next
  return Promise.resolve(fn(req, res, next)).catch((err) => catchIn(err, req, res, next))
}
