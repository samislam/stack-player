/*=============================================
=            importing dependencies            =
=============================================*/
const express = require('express')
const log = require('@samislam/log')
const stackPlayer = require('../src/index.js')
const localErrorHandler = require('./localErrorHandler')

/*=====  End of importing dependencies  ======*/

/*=============================================
=            pre-defined Middlewares            =
=============================================*/
const newLineMiddleware = (req, res, next) => {
  log('------------------------------')
  next()
}
const sendResMiddleware = (req, res, next) => {
  log.success('sendResMiddleware ran')
  res.end(`sendResMiddleware ran`)
  next()
}

const setUser = (req, res, next) => {
  req.$USER = 'market'
  next()
}
/*=====  End of pre-defined Middlewares  ======*/

const app = express()

// ^ test #-2
// * (middlewareStacks: function --> [], options: ---)
// ? uncomment the following code block to test

// app.route('/api').get(
//   stackPlayer(() => [], { callNext: true, autoCallNext: true }),
//   sendResMiddleware
// )

// ^ test #-1
// * (middlewareStacks: function --> undefined, options: ---)
// ? uncomment the following code block to test

// app.route('/api').get(
//   stackPlayer(() => {}, { callNext: true }),
//   sendResMiddleware
// )

// ^ test #0
// * (middlewareStacks: function --> [], options: ---)
// ? uncomment the following code block to test

// app.route('/api').get(stackPlayer([], { callNext: true }), sendResMiddleware)

// ^ test #1
// * (middlewareStacks: function --> [], options: ---)
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     (req) =>
//       ({
//         admin: [
//           (req, res, next) => {
//             log.i('/api -> stackPlayer -> admin middleware #1')
//             // next()
//           },
//           (req, res, next) => {
//             log.i('/api -> stackPlayer -> admin middleware #2')
//             // next()
//           },
//           (req, res, next) => {
//             log.i('/api -> stackPlayer -> admin middleware #3')

//             // next()
//           },
//         ],
//         market: [
//           (req, res, next) => {
//             log.i('/api -> stackPlayer -> market middleware #1')
//             next()
//           },
//           (req, res, next) => {
//             log.i('/api -> stackPlayer -> market middleware #2')
//             next()
//           },
//           (req, res, next) => {
//             log.i('/api -> stackPlayer -> market middleware #3')
//             next()
//           },
//         ],
//       }[req.$USER]),
//   ),
//   sendResMiddleware
// )

// ^ test #5
// * quick make sure, middlewareStack: [...]
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer([
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #1')
//       // next()
//     },
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #2')
//       // next()
//     },
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #3')
//       // next()
//     },
//   ]),
//   sendResMiddleware
// )

// ^ test #6
// * options: {!autoCallNext}
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     [
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #1')
//         // next()
//       },
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #2')
//         // next()
//       },
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #3')
//         next()
//       },
//     ],
//     {
//       autoCallNext: true,
//       // callNext: true,
//     }
//   ),
//   sendResMiddleware
// )

// ^ test #7
// * !autoCallNext + stack legnth is 1
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     [
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #1')
//         // next()
//       },
//     ],
//     {
//       // autoCallNext: false,
//       // callNext: true,
//     }
//   ),
//   sendResMiddleware
// )

// ^ test #8
// * !autoCallNext + stack legnth is 0
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer([], {
//     callNext: true,
//     autoCallNext: true,
//   }),
//   sendResMiddleware
// )

// ^ test #9
// * !callNextAfterstackPlayer + stack is undefined
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(() => {}, { callNext: false, autoCallNext: true }),
//   sendResMiddleware
// )

// ^ test #10
// * cause an error in the body of middlewareStack (sync)
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     () => {
//       x.y.z // should throw an error
//       return []
//     },
//     {
//       autoCallNext: false,
//     }
//   ),
//   sendResMiddleware
// )

// ^ test #11
// * cause an error in the body of middlewareStack (async)
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     async () => {
//       x.y.z // should throw an error
//       return []
//     },
//     {
//       autoCallNext: false,
//     }
//   ),
//   sendResMiddleware
// )

// ^ test #12
// * cause an error in the body of middlewareStack (async)
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(async () => {
//     x.y.z // should throw an error
//     return []
//   }),
//   () => {
//     console.log('running the middleware after stackPlayer which had an error')
//   },
//   sendResMiddleware
// )

// ^ test #13
// * middlewareStack: asyncfunc --> [...async()=>{}]
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(async (req) => [
//     async (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #1')
//       next()
//     },
//     async (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #2')
//       next()
//     },
//     async (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #3')
//       next()
//     },
//   ]),
//   sendResMiddleware
// )

// ^ test #14
// * middlewareStack: asyncfunc --> [()=>{},async()=>{},()=>{}]
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(async (req) => [
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #1')
//       next()
//     },
//     async (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #2')
//       const x = async () => {}
//       await x()
//       next()
//     },
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #3')
//       next()
//     },
//   ]),
//   sendResMiddleware
// )

// ^ test #15
// * middlewareStack: asyncfunc --> [()=>{},async()=>{error!},()=>{}]
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(async (req) => [
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #1')
//       next()
//     },
//     async (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #2')
//       const x = async () => { throw new Error("some error in async middleware #2")}
//       await x()
//       next()
//     },
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #3')
//       next()
//     },
//   ]),
//   sendResMiddleware
// )

// ^ test #16
// * middlewareStack: asyncfunc --> [()=>{error!},async()=>{error!},()=>{}]
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(async (req) => [
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #1')
//       throw new Error('some error in middleware #1')
//       next()
//     },
//     async (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #2') // & this middleware must run automatically even thought the previous one had an error
//       // const x = async () => {
//       //   throw new Error('some async error in async middleware #2')
//       // }
//       // await x()
//       throw new Error('some immediate error in async middleware #2')
//       // next()
//     },
//     (req, res, next) => {
//       log.i('/api -> stackPlayer -> admin middleware #3')

//       // next()
//     },
//   ]),
//   sendResMiddleware
// )

// ^ test #17
// * middlewareStack: asyncfunc --> [()=>{error!},async()=>{error!},()=>{}] + !tryCatchWrap
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     async (req) => [
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #1')
//         throw new Error('some error in middleware #1')
//         next()
//       },
//       async (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #2') // & this middleware shouldn't run automatically unless next() was explicitly called (and only if you're calling it inside a local error handler)
//         const x = async () => {
//           throw new Error('some async error in async middleware #2')
//         }
//         await x()
//         throw new Error('some immediate error in async middleware #2')
//         next()
//       },
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #3') // & this middleware shouldn't run automatically unless next() was explicitly called (and only if you're calling it inside a local error handler)

//         // next()
//       },
//     ],
//     { tryCatchWrap: false }
//   ),
//   sendResMiddleware
// )

// ^ test #18
// * middlewareStack: asyncfunc --> [()=>{error!},async()=>{error!},()=>{}] + !tryCatchWrap
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     async (req) => [
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #1')
//         throw new Error('some error in middleware #1')
//         // next()
//       },
//       async (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #2') // & this middleware shouldn't run automatically
//         // const x = async () => {
//         //   throw new Error('some async error in async middleware #2')
//         // }
//         // await x()
//         // throw new Error('some immediate error in async middleware #2')
//         // next()
//       },
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #3') // & this middleware shouldn't run automatically
//         // next()
//       },
//     ],
//     { autoCallNext: true, callNext: true }
//   ),
//   sendResMiddleware
// )

// ^ test #19
// * testing async order, without error
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     async (req) => [
//       async (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin async middleware #1')
//         const asyncFunc1 = async () => {}
//         const asyncFunc2 = async () => {}
//         const asyncFunc3 = async () => {}
//         await asyncFunc1()
//         await asyncFunc2()
//         await asyncFunc3()
//       },
//       (req, res, next) => {
//         log.i('/api -> stackPlayer -> admin middleware #2')
//         next()
//       },
//     ],
//     { autoCallNext: true }
//   ),
//   sendResMiddleware
// )

// ^ test #20
// * middlewareStack: ()=>()=>{}
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     async (req) => (req, res, next) => {
//       console.log('running a singular middleware')
//       // next()
//     },
//     { autoCallNext: true, callNext: true }
//   ),
//   sendResMiddleware
// )

// ^ test #21
// * middlewareStack: ()=>{throw error, return []}, handle with local error handler
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     async (req) => {
//       throw new Error('new error happened inside the function')
//       return (req, res, next) => console.log('running a singular middleware')
//     },
//     { localErrorHandler }
//   ),
//   sendResMiddleware
// )

// ^ test #22
// * middlewareStack: ()=> ()=> { next() }
// ? uncomment the following code block to test

// app.route('/api').get(
//   newLineMiddleware,
//   setUser,
//   stackPlayer(
//     (req, res, next) => {
//       console.log('running the middleware wrapper for singlular mw')
//       return (req, res, next) => {
//         console.log('cors middleware ran')
//         throw new Error('error from inside the singular middleware')
//         next()
//       }
//     },
//     { localErrorHandler }
//   ),
//   (req, res, next) => {
//     console.log('hello from mw after stack-player')
//     res.send('mew!')
//   }
// )

app.use((error, req, res, next) => {
  console.log('caught an error in the global error handler')
  console.log(error)
  res.status(500).json({ message: 'Ooops! something went wrong!' })
  next()
})

console.clear()
app.listen(8000, () => log.info(log.label, 'test listening on port 8000'))
