import type { NextFunction, RequestHandler, Request, Response, ErrorRequestHandler } from 'express'

export type SingularMiddleware = RequestHandler
export type MiddlewareStack = RequestHandler[]
export type FunctionalMiddleware = (
  req: Request,
  res: Response,
  sNext: NextFunction
) => RequestHandler
export type FunctionalMiddlewareStack = (
  req: Request,
  res: Response,
  sNext: NextFunction
) => RequestHandler[]

export type StackType =
  | SingularMiddleware // RequestHandler
  | MiddlewareStack // RequestHandler[]
  | FunctionalMiddleware // ((req: Request, res: Response, sNext: NextFunction) => RequestHandler)
  | FunctionalMiddlewareStack // ((req: Request, res: Response, sNext: NextFunction) => RequestHandler[])

export type StackTypeName =
  | 'SingularMiddleware'
  | 'MiddlewareStack'
  | 'FunctionalMiddleware'
  | 'FunctionalMiddlewareStack'

export interface Options {
  autoCallNext?: boolean
  callNext?: boolean
  localErrorHandler?: ErrorRequestHandler
}

// singularMiddleware @param stack: (req,res,sNext)=>{}, ~ useful only for calling next by stack-player.
// functionalMiddleware: @param stack: (req,res,sNext)=>(req,res,sNext)=>{}
// functionalMiddlewareStack: @param stack: (req,res,sNext)=>[(req,res,sNext)=>{}]
// middlewareStack @param stack: [(req,res,sNext)=>{}]
