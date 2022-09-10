/*=============================================
=            importing dependencies            =
=============================================*/
const catchAsync = require('./utils/catchAsync')
const { to } = require('./utils/await-to-simplified')
const SwitcherError = require('./utils/SwitcherError')
const { getOptionsValue, getMiddlewareStack } = require('./utils/getValues')
/*=====  End of importing dependencies  ======*/

function switcher(middlewareStacks, options = {}) {
  // @param middlewareStacks: array | function
  // @param options: object | function
  return catchAsync(!options.disableLEHForStackResolver && options.localErrorHandler, async (req, res, next) => {
    // Get the parameters values ---------------
    const reqresnext = [req, res, next]
    const [chosenOptions] = await getOptionsValue(options, reqresnext, {
      tryCatchWrap: true,
      autoCallNext: true,
      callNextAfterSwitcher: true,
      localErrorHandler: undefined,
      else: (req, res, next) => next(),
      disableLEHForStackResolver: false,
    })
    const stack = await getMiddlewareStack(middlewareStacks, chosenOptions.else, [...reqresnext, chosenOptions.localErrorHandler])

    // Execute  ---------------
    const sNext = (error) => {
      wasSNextCalled = flagWillLeaveSwitcher ? false : true
      if (error) {
        next(error)
        handledToErrorHandler = true
      }
    }
    // initializing the state -----
    let wasSNextCalled = false // init
    let handledToErrorHandler = false // init
    let flagWillLeaveSwitcher = false // init
    let i = 1 // init

    for (const middleware of stack) {
      wasSNextCalled = false // reset
      if (stack.length === i) flagWillLeaveSwitcher = true // if reached the last middleware in the stack, flag to exit switcher by the end of the tick
      const args = [req, res, sNext, chosenOptions.localErrorHandler]
      const [error] = await to(() => middleware(...args))
      if (error) {
        if (!chosenOptions.tryCatchWrap) throw error
        if (!chosenOptions.localErrorHandler) sNext(error)
        else {
          const args = [error, req, res, sNext]
          const [localErrorHandlerError] = await to(() => chosenOptions.localErrorHandler(...args))
          handledToErrorHandler = true
          if (localErrorHandlerError) {
            sNext(
              new SwitcherError('Local error handler error!', 1000, {
                localErrorHandlerError,
                middlewareError: error,
                ...args,
              })
            )
          }
        }
      }
      if (!wasSNextCalled && !chosenOptions.autoCallNext) break // exit switcher if sNext() wasn't called
      if (handledToErrorHandler) break // break if sNext() was called with an error
      i++
    }
    if (chosenOptions.callNextAfterSwitcher) next()
  })
}

/*----------  end of code, exporting  ----------*/
module.exports = switcher
