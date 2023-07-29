export const get = <T, R>(object: T, path: string): R => {
  if (!path || (path && path.trim() === '')) {
    throw Error('path need to be present');
  }

  const arr = path.split('.') as string[];
  // @ts-expect-error
  const value = arr.reduce<R>((acc, currentProp) => (acc && acc[currentProp]) || undefined, object);

  // @ts-expect-error
  return value;
};
