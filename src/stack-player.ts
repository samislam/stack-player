import catchAsync from 'catch-async-wrapper-express'
import type {
  Options,
  StackType,
  StackTypeName,
  MiddlewareStack,
  FunctionalMiddleware,
  FunctionalMiddlewareStack,
} from 'types'
import { isAsycOrSyncFunc, isArray } from '@samislam/checktypes'
import { RequestHandler } from 'express'

export function stackplayer(stack: StackType, options: Options = {}) {
  const { autoCallNext = false, callNext = false, localErrorHandler } = options
  return catchAsync(async (req, res, next) => {
    // & analyze the given arguments ---------------
    // * Global variables -----
    let typeOfResult: StackTypeName
    let result: ReturnType<Exclude<StackType, MiddlewareStack>>
    let evaluatedResult: RequestHandler[]

    if (isArray(stack)) {
      evaluatedResult = stack as MiddlewareStack
      typeOfResult = 'MiddlewareStack'
    } else {
      // result could be the singular middleware, so it's executing here
      result = await (stack as Exclude<StackType, MiddlewareStack>)(req, res, next)
      switch (true) {
        case isAsycOrSyncFunc(result):
          typeOfResult = 'FunctionalMiddleware'
          evaluatedResult = [result as ReturnType<FunctionalMiddleware>]
          break
        case isArray(result):
          typeOfResult = 'FunctionalMiddlewareStack'
          evaluatedResult = result as ReturnType<FunctionalMiddlewareStack>
          break
        default:
          typeOfResult = 'SingularMiddleware'
          evaluatedResult = [] // ~> already executed, done
      }
    }

    // & handle stacks ---------------
    let i = 0
    let wasSNextCalled = evaluatedResult.length ? true : false // init
    let wasSNextCalledWithErr = false
    const isAllDone = () => i === evaluatedResult.length
    const sNext = (err: unknown) => {
      if (err) {
        wasSNextCalledWithErr = true
        next(err)
      }
      wasSNextCalled = true
    }
    while (
      i < evaluatedResult.length &&
      !wasSNextCalledWithErr &&
      (wasSNextCalled || autoCallNext)
    ) {
      const middleware = evaluatedResult[i]
      wasSNextCalled = false // reset
      i++
      await middleware(req, res, sNext)
    }

    if (isAllDone() && !wasSNextCalledWithErr && (wasSNextCalled || callNext)) next()
  }, localErrorHandler)
}

export default stackplayer
