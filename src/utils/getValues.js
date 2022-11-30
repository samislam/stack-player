/*=============================================
=            importing dependencies            =
=============================================*/
const _ = require('lodash')
const { to } = require('./await-to-simplified')
const checkTypes = require('@samislam/checktypes')

/*=====  End of importing dependencies  ======*/

const getOptionsValue = async (userGivenOptionsArg, args, defaultOptions) => {
  let optionsValue
  if (checkTypes.isAsycOrSyncFunc(userGivenOptionsArg)) {
    const [error, obj] = await to(() => userGivenOptionsArg(...args))
    if (error) throw error
    optionsValue = obj
  } else optionsValue = userGivenOptionsArg

  const chosenOptions = {}
  _.merge(chosenOptions, defaultOptions, optionsValue)
  return [chosenOptions, defaultOptions]
}

const getMiddlewareStack = async (userGivenMWStacks, args = []) => {
  switch (true) {
    case checkTypes.isArray(userGivenMWStacks):
      return userGivenMWStacks // array
    case checkTypes.isAsycOrSyncFunc(userGivenMWStacks):
      const [error, stack] = await to(() => userGivenMWStacks(...args))
      if (error) throw error
      if (checkTypes.isArray(stack)) return stack // array, userGivenMWStacks was a function which returned an array
      if(checkTypes.isAsycOrSyncFunc(stack)) return [stack] // function, userGivenMWStacks was a function which returned a function
      return null // else = userGivenMWStacks was a function which returned anything except an array or function
  }

  return stackValue
}

/*----------  end of code, exporting  ----------*/
module.exports = {
  getOptionsValue,
  getMiddlewareStack,
}
