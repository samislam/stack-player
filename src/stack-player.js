/*=============================================
=            importing dependencies            =
=============================================*/
const catchAsync = require('./utils/catchAsync')
const { to } = require('./utils/await-to-simplified')
const StackPlayerError = require('./utils/StackPlayerError')
const { getOptionsValue, getMiddlewareStack } = require('./utils/getValues')
/*=====  End of importing dependencies  ======*/

function stackPlayer(middlewareStacks, options = {}) {
  // @param middlewareStacks: array<function> | function<array<function> || function>
  // @param options: object | function
  const middleware = async (req, res, next) => {
    // Get the parameters values ---------------
    const [chosenOptions] = await getOptionsValue(options, [req, res, next], {
      callNext: false,
      tryCatchWrap: true,
      autoCallNext: false,
      // localErrorHandler: next, but we can't do it, no worries, we're doing it though. duh
    })
    const stack = await getMiddlewareStack(middlewareStacks, [req, res, next, chosenOptions.localErrorHandler])
    if (!stack)
      if (chosenOptions.callNext) return next()
      else return // the given middlewareStacks was a function which didn't result in an array
    // Execute (we have an array of middlewares) ---------------
    const sNext = (error) => {
      wasSNextCalled = true
      errorHappen = false // reset
      if (error) {
        errorHappen = true
        next(error)
      } else if (stack.length === i + 1) next()
    }
    // initializing the state -----
    let wasSNextCalled = true // init
    let errorHappen = false // init
    let i = -1 // init
    while (i <= stack.length && wasSNextCalled && !errorHappen) {
      // exit if sNext() wasn't called
      // break if sNext() was called with an error
      i++
      const middleware = stack[i]
      if (!middleware) break // handle empty array case
      if (!chosenOptions.autoCallNext) wasSNextCalled = false // reset
      const [error] = await to(() => middleware(req, res, sNext, chosenOptions.localErrorHandler))
      if (!error) continue
      if (!chosenOptions.localErrorHandler) throw error
      const [localErrorHandlerError] = await to(() => {
        errorHappen = true
        return chosenOptions.localErrorHandler(error, req, res, sNext)
      })
      if (!localErrorHandlerError) continue
      sNext(
        new StackPlayerError('Local error handler error!', 1000, {
          localErrorHandlerError,
          middlewareError: error,
        })
      )
    }
    // console.log({ errorHappen, callNext: chosenOptions.callNext, autoCallNext: chosenOptions.autoCallNext })
    if (!errorHappen && chosenOptions.callNext && chosenOptions.autoCallNext) return next()
    if (!errorHappen && chosenOptions.callNext && !wasSNextCalled && stack.length === i + 1) return next()
  }
  if (options.localErrorHandler) return catchAsync(options.localErrorHandler, middleware)
  if (options.tryCatchWrap) return catchAsync(undefined, middleware)
  return middleware
}

/*----------  end of code, exporting  ----------*/
module.exports = stackPlayer
