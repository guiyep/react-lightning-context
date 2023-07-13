import { INTERNAL } from '../../lib/constants';
import { useInternalContext } from '../useInternalContext';

export const useContext = ({ slices }, Context) =>
  useInternalContext({ slices, defaultValue: Context[INTERNAL].defaultValue }, Context[INTERNAL].InternalContext);
