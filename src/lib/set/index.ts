export const set = <T, R>(obj: T, path: string, value: R): T => {
  var schema = obj;
  var pList = path.split('.');
  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    // @ts-expect-error
    if (!schema[elem]) schema[elem] = {};
    // @ts-expect-error
    schema = schema[elem];
  }

  //@ts-expect-error
  schema[pList[len - 1]] = value;

  return obj;
};
