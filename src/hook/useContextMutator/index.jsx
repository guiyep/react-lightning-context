import React, { useContext, useCallback } from 'react';
import { set } from '../../lib/set';
import { get } from '../../lib/get';
import { INTERNAL } from '../../lib/constants';

export const useContextMutator = (Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);
  return setContextValue;
};

export const useContextPropMutator = ({ prop }, Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);

  const setContextPropValue = useCallback(
    (f) => {
      setContextValue((value) => {
        const newVal = { ...value };
        return set(newVal, prop, f(get(value, prop)));
      });
    },
    [prop, setContextValue],
  );

  return setContextPropValue;
};
