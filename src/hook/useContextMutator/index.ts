import { useContext, useCallback } from 'react';
import { set } from '../../lib/set';
import { get } from '../../lib/get';
import { INTERNAL } from '../../lib/constants';
import type { Context as ContextType, SetContextValueFunction } from '../../lib/create-context/types';

export const useContextMutator = <ContextShape>(
  Context: ContextType<ContextShape>,
): SetContextValueFunction<ContextShape> => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);
  return setContextValue;
};

export const useContextSliceMutator = <ContextShape, SliceShape>(
  slice: string,
  Context: ContextType<ContextShape>,
): SetContextValueFunction<SliceShape> => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);

  const setContextPropValue = useCallback(
    (f) => {
      setContextValue((value: ContextShape) => {
        const newVal = { ...value };
        return set(newVal, slice, f(get(value, slice)));
      });
    },
    [slice, setContextValue],
  );

  return setContextPropValue;
};
