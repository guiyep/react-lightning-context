import { useContext, useLayoutEffect, useState } from 'react';
import { addListener, removeListener } from '../../lib/pubsub';
import { get } from '../../lib/get';

export const useInternalContext = ({ listenTo, defaultValue }, InternalContext) => {
  const { queueId, addBinding, removeLightning } = useContext(InternalContext);
  const [value, setValue] = useState(undefined);

  useLayoutEffect(() => {
    const onListenerCall = ({ newValue }) => {
      setValue(newValue);
    };

    listenTo.forEach((currentBind) => {
      addBinding(currentBind);
      addListener({ queueId, key: currentBind, listener: onListenerCall });
    });

    return () => {
      listenTo.forEach((currentBind) => {
        removeLightning(currentBind);
        removeListener({ queueId, key: currentBind, listener: onListenerCall });
      });
    };
  }, [listenTo, addBinding, queueId, removeLightning]);

  // on first render, there is no value, we use the default
  if (!value) {
    const resultValue = listenTo.reduce((acc, currentBind) => {
      acc[currentBind] = get(defaultValue, currentBind);
      return acc;
    }, {});

    return resultValue;
  }

  const resultValue = listenTo.reduce((acc, currentBind) => {
    acc[currentBind] = get(value, currentBind);
    return acc;
  }, {});

  return resultValue;
};
