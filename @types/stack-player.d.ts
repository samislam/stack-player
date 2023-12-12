/// <reference types="qs" />
import type { Options, StackType } from './types';
import { RequestHandler } from 'express';
export declare function stackplayer(stack: StackType, options?: Options): RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default stackplayer;
//# sourceMappingURL=stack-player.d.ts.map