import { useContext, useLayoutEffect, useState, Context as ReactContext } from 'react';
import { addListener, removeListener } from '../../lib/pubsub';
import type { InternalContextTypes } from '../../lib/create-context/types';
import { get } from '../../lib/get';
import { set } from '../../lib/set';

export const useInternalContext = <ContextShape, ResultShape>(
  { slices, defaultValue }: { slices: string[]; defaultValue: ContextShape },
  InternalContext: ReactContext<InternalContextTypes>,
): ResultShape => {
  const { queueId, addBinding, removeLightning } = useContext(InternalContext);
  const [value, setValue] = useState(undefined);

  useLayoutEffect(() => {
    const onListenerCall = ({ newValue }: { newValue: any }) => {
      setValue(newValue);
    };

    slices.forEach((currentBind) => {
      addBinding(currentBind);
      addListener({ queueId, key: currentBind, listener: onListenerCall });
    });

    return () => {
      slices.forEach((currentBind) => {
        removeLightning(currentBind);
        removeListener({ queueId, key: currentBind, listener: onListenerCall });
      });
    };
  }, [slices, addBinding, queueId, removeLightning]);

  // on first render, there is no value, we use the default
  if (!value) {
    const resultValue = slices.reduce((acc, currentBind) => {
      set(acc, currentBind, get(defaultValue, currentBind));
      return acc;
    }, {} as ResultShape);

    return resultValue;
  }

  const resultValue = slices.reduce((acc, currentBind) => {
    set(acc, currentBind, get(value, currentBind));
    return acc;
  }, {} as ResultShape);

  return resultValue;
};
