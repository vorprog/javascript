const kvp = require('./keyValuePair');
const defaultOperation = (key, value) => new kvp(key, value);

module.exports = (collection, operation = defaultOperation) => {
  const isCollectionEmpty = !collection || (isNaN(collection) && Object.keys(collection).length == 0);
  if(isCollectionEmpty) return;

  const isCollectionAnArray = Array.isArray(collection);
  const isCollectionAnInteger = isFinite(collection);

  if (isCollectionAnInteger) collection = new Array(collection).fill(true);

  let completedIterations = 0;
  const objectResult = {};

  for (const [key, value] of Object.entries(collection)) {
    const formattedKey = isCollectionAnArray ? parseInt(key) : key;
    const iterationResult = operation(formattedKey, value, completedIterations);

    if (iterationResult == null) continue;

    if (iterationResult instanceof kvp)
      objectResult[iterationResult.key] = iterationResult.value;
    else objectResult[completedIterations] = iterationResult;

    completedIterations++;
  }

  return objectResult;
};
