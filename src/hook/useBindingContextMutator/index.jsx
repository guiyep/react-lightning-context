import React, { useContext } from 'react';
import { INTERNAL } from '../../lib/constants';

export const useBindingContextMutator = (Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);
  return setContextValue;
};
