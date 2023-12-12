import type { NextFunction, RequestHandler, Request, Response, ErrorRequestHandler } from 'express';
export type SingularMiddleware = RequestHandler;
export type MiddlewareStack = RequestHandler[];
export type FunctionalMiddleware = (req: Request, res: Response, sNext: NextFunction) => RequestHandler;
export type FunctionalMiddlewareStack = (req: Request, res: Response, sNext: NextFunction) => RequestHandler[];
export type StackType = SingularMiddleware | MiddlewareStack | FunctionalMiddleware | FunctionalMiddlewareStack;
export type StackTypeName = 'SingularMiddleware' | 'MiddlewareStack' | 'FunctionalMiddleware' | 'FunctionalMiddlewareStack';
export interface Options {
    autoCallNext?: boolean;
    callNext?: boolean;
    localErrorHandler?: ErrorRequestHandler;
}
//# sourceMappingURL=types.d.ts.map