import { INTERNAL } from '../../lib/constants';
import { useInternalContext } from '../useInternalContext';
import type { Context as ContextType } from '../../lib/create-context/types';

export const useContext = <ContextShape>(
  { slices }: { slices: string[] },
  Context: ContextType<ContextShape>,
): ContextShape =>
  useInternalContext({ slices, defaultValue: Context[INTERNAL].defaultValue }, Context[INTERNAL].InternalContext);
