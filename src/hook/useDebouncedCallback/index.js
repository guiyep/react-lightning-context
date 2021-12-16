import debounce from 'lodash.debounce';
import { useCallback } from 'react';

export const useDebouncedCallback = (callback, wait = 150) => {
  const debouncedCallbackHandler = useCallback(
    () => debounce(callback, wait, { leading: false, trailing: true }),
    [callback, wait],
  );

  return debouncedCallbackHandler();
};
