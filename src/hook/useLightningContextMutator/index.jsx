import React, { useContext } from 'react';
import { INTERNAL } from '../../lib/constants';

export const useLightningContextMutator = (Context) => {
  const { setContextValue } = useContext(Context[INTERNAL].InternalContext);
  return setContextValue;
};
