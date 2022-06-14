const convertUserFilterToMongoQueryOperator = (
  userFilter,
  supportedColumns
) => {
  const queryObject = {};

  if (!userFilter) {
    return queryObject;
  }

  const operatorMap = {
    '>': '$gt',
    '>=': '$gte',
    '=': '$eq',
    '!=': '$neq',
    '<': '$lt',
    '<=': '$lte'
  };
  const regEx = /\b(<|>|>=|=|<|<=)\b/g;

  userFilter
    .replace(regEx, (match) => `-${operatorMap[match]}-`)
    .split(',')
    .forEach((item) => {
      const [field, operator, value] = item.split('-');

      if (supportedColumns.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });

  return queryObject;
};

module.exports = { convertUserFilterToMongoQueryOperator };
