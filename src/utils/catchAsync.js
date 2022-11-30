module.exports = (errorHandler, fn) => (req, res, next) => {
  const catchIn = errorHandler ?? next
  return Promise.resolve(fn(req, res, next)).catch((err) => catchIn(err, req, res, next))
}
