import React from 'react';
import { INTERNAL } from '../../lib/constants';
import { useInternalContext } from '../useInternalContext';

export const useContext = ({ listenTo }, Context) =>
  useInternalContext({ listenTo, defaultValue: Context[INTERNAL].defaultValue }, Context[INTERNAL].InternalContext);
