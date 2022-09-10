class SwitcherError extends Error {
  constructor(message, code, error) {
    super(message)
    this.name = 'switcherError'
    this.code = code
    this.error = error
    Error.captureStackTrace(this, this.constructor)
  }
}

/*----------  end of code, exporting  ----------*/

module.exports = SwitcherError
