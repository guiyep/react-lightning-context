import { INTERNAL } from '../../lib/constants';
import { get } from '../../lib/get';
import { useInternalContext } from '../useInternalContext';
import type { Context as ContextType } from '../../lib/create-context/types';

export const useContextSlice = <ContextShape, SliceShape>(
  slice: string,
  Context: ContextType<ContextShape>,
): SliceShape => {
  const value = useInternalContext(
    { slices: [slice], defaultValue: Context[INTERNAL].defaultValue },
    Context[INTERNAL].InternalContext,
  );
  return get(value, slice);
};
