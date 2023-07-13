import React, { useContext, useCallback } from 'react';
import { set } from '../../lib/set';
import { get } from '../../lib/get';
import { INTERNAL } from '../../lib/constants';

export const useContextMutator = (Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);
  return setContextValue;
};

export const useContextSliceMutator = ({ slice }, Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);

  const setContextPropValue = useCallback(
    (f) => {
      setContextValue((value) => {
        const newVal = { ...value };
        return set(newVal, slice, f(get(value, slice)));
      });
    },
    [slice, setContextValue],
  );

  return setContextPropValue;
};
