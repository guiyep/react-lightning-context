import React from 'react';
import { INTERNAL } from '../../lib/constants';
import { useInternalContext } from '../useInternalContext';

export const useContextSlice = ({ slice }, Context) =>
  useInternalContext(
    { slices: [slice], defaultValue: Context[INTERNAL].defaultValue },
    Context[INTERNAL].InternalContext,
  );
