async function to(fn) {
  let error, data
  try {
    data = await fn()
  } catch (err) {
    error = err
  }
  return [error, data]
}

/*----------  end of code, exporting  ----------*/
module.exports = { to }
