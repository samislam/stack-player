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

const getMiddlewareStack = async (userGivenMWStacks, elseMw, args = []) => {
  let stackValue
  switch (true) {
    case checkTypes.isArray(userGivenMWStacks):
      stackValue = userGivenMWStacks
      break
    case checkTypes.isAsycOrSyncFunc(userGivenMWStacks):
      const [error, stack] = await to(() => userGivenMWStacks(...args))
      if (error) throw error
      stackValue = stack
  }

  if (checkTypes.isAsycOrSyncFunc(stackValue)) stackValue = [stackValue]
  else if (!checkTypes.isArray(stackValue)) stackValue = [elseMw]

  return stackValue
}

/*----------  end of code, exporting  ----------*/
module.exports = {
  getOptionsValue,
  getMiddlewareStack,
}
