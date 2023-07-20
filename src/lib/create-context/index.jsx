import React, { useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { get } from '../get';
import { initialize, publish } from '../pubsub';
import { INTERNAL } from '../constants';
import { useInternalContext } from '../../hook/useInternalContext';
import { useDebouncedCallback as useDebouncedCallbackHook } from '../../hook/useDebouncedCallback';

const useDebouncedDisabledCallback = (f) => (val) => f(val);

export const createContext = (defaultValue, { waitBeforeUpdate } = { waitBeforeUpdate: false }) => {
  const InternalContext = React.createContext({
    queueId: undefined,
    addBinding: () => {},
    removeLightning: () => {},
  });

  const useDebouncedCallback = !waitBeforeUpdate ? useDebouncedDisabledCallback : useDebouncedCallbackHook;

  return {
    Provider: ({ children, initialValue }) => {
      const queueIdRef = useRef();
      const bindingsRef = useRef({});
      const valueRef = useRef(defaultValue);

      useMemo(() => {
        if (!queueIdRef.current) {
          queueIdRef.current = initialize();
        }
      }, []);

      const queueId = queueIdRef.current;

      const addBinding = useCallback((path) => {
        const currentValue = bindingsRef.current[path];
        bindingsRef.current[path] = currentValue ? currentValue + 1 : 1;
      }, []);

      const removeLightning = useCallback((path) => {
        const currentValue = bindingsRef.current[path];
        bindingsRef.current[path] = currentValue > 0 ? currentValue - 1 : 0;

        if (bindingsRef.current[path] === 0) {
          delete bindingsRef.current[path];
        }
      }, []);

      const setContextValue = useCallback(
        (f) => {
          const val = f(valueRef.current);
          onPublishEvents(val);
        },
        [onPublishEvents],
      );

      const contextRef = useRef({
        queueId,
        addBinding,
        removeLightning,
        setContextValue,
      });

      const onPublishEvents = useDebouncedCallback((nextValue) => {
        const bindings = bindingsRef.current;
        const oldValue = valueRef.current;

        // publish changes to all the listeners, maybe performance here?

        Object.keys(bindings).forEach((currentBind) => {
          const nextLightningValue = get(nextValue, currentBind);
          const oldLightningValue = get(oldValue, currentBind);

          if (oldLightningValue !== nextLightningValue) {
            const event = {
              newValue: nextValue,
              change: { bind: currentBind, value: nextLightningValue },
            };

            publish({ queueId, key: currentBind, event });
          }
        });

        valueRef.current = nextValue;
      }, waitBeforeUpdate);

      useLayoutEffect(() => {
        if (contextRef.current === undefined || initialValue !== undefined) {
          setContextValue(() => initialValue);
        }
      }, [initialValue, setContextValue]);

      return <InternalContext.Provider value={contextRef.current}>{children}</InternalContext.Provider>;
    },
    Mutator: ({ children }) => {
      const { setContextValue } = useContext(InternalContext);
      return children({ setContextValue });
    },
    Consumer: ({ slices, children }) => {
      const resultValue = useInternalContext({ slices, defaultValue }, InternalContext);
      return children(resultValue);
    },
    [INTERNAL]: {
      InternalContext,
      defaultValue,
    },
    displayName: undefined,
  };
};
