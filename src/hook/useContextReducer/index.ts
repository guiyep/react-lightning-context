import { useContext, useCallback } from 'react';
import { INTERNAL } from '../../lib/constants';
import type { Context as ContextType } from '../../lib/create-context/types';

export const useContextReducer = <ContextShape>(
  reducer: (value: ContextShape, action: { type: string }) => ContextShape,
  Context: ContextType<ContextShape>,
) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);

  const dispatch = useCallback(
    (action) => {
      setContextValue((value: ContextShape) => reducer(value, action));
    },
    [reducer, setContextValue],
  );

  return dispatch;
};
