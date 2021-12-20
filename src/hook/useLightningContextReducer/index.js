import { useContext, useCallback } from 'react';
import { INTERNAL } from '../../lib/constants';

export const useLightningContextReducer = (reducer, Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);

  const dispatch = useCallback(
    (action) => {
      setContextValue((value) => reducer(value, action));
    },
    [reducer, setContextValue],
  );

  return dispatch;
};
