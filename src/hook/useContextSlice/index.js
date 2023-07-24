import { INTERNAL } from '../../lib/constants';
import { get } from '../../lib/get';
import { useInternalContext } from '../useInternalContext';

export const useContextSlice = (slice, Context) => {
  const value = useInternalContext(
    { slices: [slice], defaultValue: Context[INTERNAL].defaultValue },
    Context[INTERNAL].InternalContext,
  );
  return get(value, slice);
};
