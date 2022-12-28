import debug from './utils/debug.js'
import mergeObjects from './utils/mergeObjects.js'
import catchAsync from 'catch-async-wrapper-express'
import { isAsycOrSyncFunc, isArray } from '@samislam/checktypes'

export default function stackPlayer(stack, options_ = {}) {
  // options:
  // localErrorHandler: undefined (next)
  // autoCallNext: false
  // callNext: false
  return catchAsync(async (req, res, next) => {
    const options = mergeObjects({ autoCallNext: false, callNext: false }, options_)
    // singularMiddleware @param stack: (req,res,sNext)=>{}, ~ useful only for calling next by stack-player.
    // functionalMiddleware: @param stack: (req,res,sNext)=>(req,res,sNext)=>{}
    // functionalMiddlewareStack: @param stack: (req,res,sNext)=>[(req,res,sNext)=>{}]
    // middlewareStack @param stack: [(req,res,sNext)=>{}]
    // & analyze the given arguments ---------------
    // * Global variables -----
    let typeOfResult, result

    if (isArray(stack)) {
      result = stack
      typeOfResult = 'middlewareStack'
    } else {
      result = await stack(req, res, next)
      switch (true) {
        case isAsycOrSyncFunc(result):
          typeOfResult = 'functionalMiddleware'
          result = [result]
          break
        case isArray(result):
          typeOfResult = 'functionalMiddlewareStack'
          break
        default:
          typeOfResult = 'singularMiddleware'
          result = []
      }
    }

    debug({ typeOfResult })

    // & handle stacks ---------------
    let i = 0
    let wasSNextCalled = result.length ? true : false // init
    let wasSNextCalledWithErr = false
    const isAllDone = () => i === result.length
    const sNext = (err) => {
      if (err) {
        wasSNextCalledWithErr = true
        next(err)
      }
      wasSNextCalled = true
    }
    while (
      i < result.length &&
      !wasSNextCalledWithErr &&
      (wasSNextCalled || options.autoCallNext)
    ) {
      const middleware = result[i]
      debug({ i, result, middleware, type: typeof middleware })
      wasSNextCalled = false // reset
      i++
      await middleware(req, res, sNext)
    }
    debug('after the loop: ', {
      wasSNextCalled,
      wasSNextCalledWithErr,
      isAllDone: isAllDone(),
    })
    if (isAllDone() && !wasSNextCalledWithErr && (wasSNextCalled || options.callNext)) next()
  }, options_.localErrorHandler)
}
