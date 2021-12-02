import get from 'lodash.get';
import { initialize, publish } from '../pubsub';
import { INTERNAL } from '../constants';
import { useInternalContext } from '../../hook/useInternalContext';
import React, { useCallback, useContext, useLayoutEffect, useEffect, useMemo, useState, useRef } from 'react';

const useDebouncedCallback = (f) => (val) => f(val);

export const createContext = (defaultValue) => {
  const InternalContext = React.createContext({ queueId: undefined, addBinding: () => {}, removeBinding: () => {} });

  return {
    Provider: ({ children }) => {
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

      const removeBinding = useCallback((path) => {
        const currentValue = bindingsRef.current[path];
        bindingsRef.current[path] = currentValue > 0 ? currentValue - 1 : 0;

        if (bindingsRef.current[path] === 0) {
          delete bindingsRef.current[path];
        }
      }, []);

      const setContextValue = useCallback((f) => {
        const val = f(valueRef.current);
        onPublishEvents(val);
      });

      const contextRef = useRef({
        queueId,
        addBinding,
        removeBinding,
        setContextValue,
      });

      const onPublishEvents = useDebouncedCallback((nextValue) => {
        const bindings = bindingsRef.current;
        const oldValue = valueRef.current;

        // publish changes to all the listeners, maybe performance here?
        for (const currentBind in bindings) {
          const nextBindingValue = get(nextValue, currentBind);
          const oldBindingValue = get(oldValue, currentBind);

          if (oldBindingValue !== nextBindingValue) {
            const event = {
              newValue: nextValue,
              change: { bind: currentBind, value: nextBindingValue },
            };

            publish({ queueId, key: currentBind, event });
          }
        }

        valueRef.current = nextValue;
      }, 250);

      return <InternalContext.Provider value={contextRef.current}>{children}</InternalContext.Provider>;
    },
    Mutator: ({ children }) => {
      const { setContextValue } = useContext(InternalContext);
      return children({ setContextValue });
    },
    Consumer: ({ binds, children }) => {
      const resultValue = useInternalContext({ binds, defaultValue }, InternalContext);
      return children(resultValue);
    },
    [INTERNAL]: {
      InternalContext,
      defaultValue,
    },
    displayName: undefined,
  };
};
