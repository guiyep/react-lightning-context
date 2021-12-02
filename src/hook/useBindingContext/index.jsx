import React from 'react';
import { INTERNAL } from '../../lib/constants';
import { useInternalContext } from '../useInternalContext';

export const useBindingContext = ({ binds }, Context) =>
  useInternalContext({ binds, defaultValue: Context[INTERNAL].defaultValue }, Context[INTERNAL].InternalContext);
