import { useContext, useCallback } from 'react';
import { set } from '../../lib/set';
import { get } from '../../lib/get';
import { INTERNAL } from '../../lib/constants';
import type { Context as ContextType, SetContextValueFunction } from '../../lib/create-context/types';

export const useContextMutator = <T1,>(Context: ContextType<T1>) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);
  return setContextValue;
};

export const useContextSliceMutator = <StateShape, SliceShape>(
  slice: string,
  Context: ContextType<StateShape>,
): SetContextValueFunction<SliceShape> => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);

  const setContextPropValue = useCallback(
    (f) => {
      setContextValue((value: StateShape) => {
        const newVal = { ...value };
        return set(newVal, slice, f(get(value, slice)));
      });
    },
    [slice, setContextValue],
  );

  return setContextPropValue;
};
