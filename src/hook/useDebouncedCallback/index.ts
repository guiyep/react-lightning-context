import debounce from 'lodash.debounce';
import { useCallback } from 'react';

const WAIT = 150;

export const useDebouncedCallback = (callback: (val: any) => void) => {
  const debouncedCallbackHandler = useCallback(
    () => debounce(callback, WAIT, { leading: false, trailing: true }),
    [callback],
  );

  return debouncedCallbackHandler();
};
