import log from '@samislam/log'
import { ErrorRequestHandler } from 'express'

export const localErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  log.error('inside local error handler')
  log(err)
  // next()
}

export default localErrorHandler
