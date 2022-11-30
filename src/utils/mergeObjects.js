const _ = require('lodash')

function mergeObjects(...sources) {
  let srcs = _.isArray(sources[0]) ? sources[0] : sources
  const mergedObject = {}
  _.merge(mergedObject, ...srcs)
  return mergedObject
}

module.exports = mergeObjects
