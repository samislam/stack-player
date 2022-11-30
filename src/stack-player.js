/*=============================================
=            importing dependencies            =
=============================================*/
const catchAsync = require('./utils/catchAsync')
const mergeObjects = require('./utils/mergeObjects')
const { to } = require('./utils/await-to-simplified')
const { getMiddlewareStack } = require('./utils/getValues')
const StackPlayerError = require('./utils/StackPlayerError')
/*=====  End of importing dependencies  ======*/

function stackPlayer(middlewareStacks, options_ = {}) {
  // @param middlewareStacks: array<function> | function<array<function> || function>
  // @param options: object | function
  const options = mergeObjects(
    {
      callNext: false,
      tryCatchWrap: true,
      autoCallNext: false,
      // localErrorHandler: next, but we can't do it, no worries, we're doing it though. duh
    },
    options_
  )

  const middleware = async (req, res, next) => {
    // Get the parameters values ---------------

    const stack = await getMiddlewareStack(middlewareStacks, [req, res, next, options.localErrorHandler])
    if (!stack)
      if (options.callNext) return next()
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
      if (!options.autoCallNext) wasSNextCalled = false // reset
      const [error] = await to(() => middleware(req, res, sNext, options.localErrorHandler))
      if (!error) continue
      if (!options.localErrorHandler) throw error
      const [localErrorHandlerError] = await to(() => {
        errorHappen = true
        return options.localErrorHandler(error, req, res, sNext)
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
    if (!errorHappen && options.callNext && options.autoCallNext) return next()
    if (!errorHappen && options.callNext && !wasSNextCalled && stack.length === i + 1) return next()
  }
  if (options.localErrorHandler) return catchAsync(options_.localErrorHandler, middleware)
  if (options.tryCatchWrap) return catchAsync(undefined, middleware)
  return middleware
}

/*----------  end of code, exporting  ----------*/
module.exports = stackPlayer
