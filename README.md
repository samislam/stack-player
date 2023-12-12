# stack-player

**stack-player** is a small, powerful Express middleware that allows for executing middlewares, switching between them conditionally, and handling their errors separately.

For example, you can use stack-player to execute Express middlewares as follows:

```typescript
userRouter.get('/:userId', stackplayer((req, res, sNext) => {
    /* your code */
}))

userRouter.get('/:userId', stackplayer((req, res, sNext) => (req, res, sNext) => {
    /* your code */
}))

userRouter.get('/:userId', stackplayer((req, res, sNext) => [
    (req, res, sNext) => { /* your code */ },
    (req, res, sNext) => { /* your code */ },
    (req, res, sNext) => { /* your code */ },
], { autoCallNext: true, callNext: true })

userRouter.get('/:userId', stackplayer([
    (req, res, sNext) => { /* your code */ },
    (req, res, sNext) => { /* your code */ },
    (req, res, sNext) => { /* your code */ },
], { autoCallNext: true, callNext: true }))

```

# How this is useful?

This opens up the doors to new express applications design patterns, for example, the following code sample demonstrates using stack-player with fancy-object to set the request within the corresponding middleware stack to the logged in user role:

```ts
userRouter.use((req, res, next) => {
  req.$loggedInUser = { role: 'admin' }
  next()
})
userRouter.get(
  '/:userId',
  stackplayer(
    (req) =>
      ({
        superadmin: [(req, res, next) => {}, (req, res, next) => {}],
        admin: [(req, res, next) => {}, (req, res, next) => {}],
        user: [(req, res, next) => {}, (req, res, next) => {}],
      }[req.$loggedInUser.role])
  )
)
```
