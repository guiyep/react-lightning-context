export const get = (object, path) => {
  if (!path || (path && path.trim() === '')) {
    throw Error('path need to be present');
  }

  const arr = path.split('.');
  return arr.reduce((acc, currentProp) => {
    return (acc && acc[currentProp]) || undefined;
  }, object);
};
