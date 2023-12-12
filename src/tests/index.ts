/*=============================================
=            importing dependencies            =
=============================================*/
import log from '@samislam/log'
import stackPlayer from '../stack-player'
import localErrorHandler from './localErrorHandler'
import catchAsync from 'catch-async-wrapper-express'
import express, { ErrorRequestHandler, RequestHandler } from 'express'
/*=====  End of importing dependencies  ======*/

/*=============================================
=            pre-defined Middlewares            =
=============================================*/
const newLineMiddleware: RequestHandler = (req, res, next) => {
  log('------------------------------')
  next()
}
const sendResMiddleware: RequestHandler = (req, res, next) => {
  log.success('sendResMiddleware ran')
  res.end(`sendResMiddleware ran`)
  next()
}

const setUser: RequestHandler = (req, res, next) => {
  ;(req as any).$USER = 'market'
  next()
}
/*=====  End of pre-defined Middlewares  ======*/

const app = express()

// ^ ~~~~~~~~~~~~~~~~ from here  ~~~~~~~~~~~~~~~~~~

// functionalMiddleware: @param stack: (req,res,sNext)=>(req,res,sNext)=>{}
// functionalMiddlewareStack: @param stack: (req,res,sNext)=>[(req,res,sNext)=>{}]
// middlewareStack @param stack: [(req,res,sNext)=>{}]

// &. functionalMiddleware tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ^ nothing
// app.get(
//   '/api',
//   stackPlayer((req, res, next) => () => {})
// )
// ^ call next (outer)
// app.get(
//   '/api',
//   stackPlayer((req, res, next) => () => {
//     next()
//   })
// )
// ^ callNext (option)
// app.get(
//   '/api',
//   stackPlayer((req, res, next) => () => {}, { callNext: true })
// )
// ^ callNext (outer)
// app.get(
//   '/api',
//   stackPlayer((req, res, next) => {
//     next()
//   })
// )
// ^ callNext (inner)
// app.get(
//   '/api',
//   stackPlayer(() => (req, res, next) => {
//     next()
//   })
// )
// ^ autoCallNext
// app.get(
//   '/api',
//   stackPlayer((req, res, next) => () => {}, { autoCallNext: true })
// )
// ^ call next with an error to global error handler (outer)
// app.get(
//   '/api',
//   stackPlayer((req, res, next) => () => {
//     next(new Error('inner error!'))
//   })
// )
// ^ call next with an error to global error handler (inner)
// app.get(
//   '/api',
//   stackPlayer(() => (req, res, next) => {
//     next(new Error('bum'))
//   })
// )
// ^ throw an error (outer)
// app.get(
//   '/api',
//   stackPlayer(() => {
//     throw new Error('outer error thrown')
//   })
// )
// ^ throw an error (inner)
// app.get(
//   '/api',
//   stackPlayer(() => () => {
//     throw new Error('outer error thrown')
//   })
// )

// ^ throw an error (outer) + localErrorHandler
// app.get(
//   '/api',
//   stackPlayer(
//     () => {
//       throw new Error('outer error thrown')
//     },
//     { localErrorHandler }
//   )
// )

// ^ throw an error (inner) + localErrorHandler
// app.get(
//   '/api',
//   stackPlayer(
//     () => () => {
//       throw new Error('outer error thrown')
//     },
//     { localErrorHandler }
//   )
// )

// ^ throw an error in middlewareStack (inner) + localError handler
// app.get(
//   '/api',
//   stackPlayer(
//     [
//       () => {
//         log.info('mw #1 ran!')
//       },
//       () => {
//         log.info('mw #2 ran!')
//         throw new Error('mw 2 error')
//       },
//       () => {
//         log.info('mw #3 ran!')
//       },
//     ],
//     { autoCallNext: true, callNext: true, localErrorHandler }
//   )
// )

// ^ next an error in middlewareStack (inner) + localError handler
// app.get(
//   '/api',
//   stackPlayer(
//     [
//       () => {
//         log.info('mw #1 ran!')
//       },
//       (req, res, next) => {
//         log.info('mw #2 ran!')
//         next(new Error('mw 2 error'))
//       },
//       () => {
//         log.info('mw #3 ran!')
//       },
//     ],
//     { autoCallNext: true, callNext: true, localErrorHandler }
//   )
// )

app.get(
  '/api',
  stackPlayer([
    catchAsync((req, res, next) => {
      log.info('mw #2 ran!')
      next(new Error('mw 2 error'))
    }, localErrorHandler),
  ])
)

app.use(sendResMiddleware)

app.use(((error, req, res, next) => {
  res.status(500).json({ message: 'Ooops! something went wrong!' })
  next()
}) as ErrorRequestHandler)

// console.clear()
app.listen(8000, () => log.info(log.label, 'test listening on port 8000'))
