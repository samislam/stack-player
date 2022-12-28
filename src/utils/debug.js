const log = require('@samislam/log')

const mode = 'production'

module.exports = function debug(...logs) {
  if (mode !== 'dev') return
  log(...logs)
}
