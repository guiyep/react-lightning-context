import React, { useContext, useLayoutEffect, useState, useRef } from 'react';
import { addListener, removeListener } from '../../lib/pubsub';
import get from 'lodash.get';

export const useInternalContext = ({ binds, defaultValue }, InternalContext) => {
  const { queueId, addLightning, removeLightning } = useContext(InternalContext);
  const [value, setValue] = useState(undefined);

  useLayoutEffect(() => {
    const onListenerCall = ({ newValue }) => {
      setValue(newValue);
    };

    binds.forEach((currentBind) => {
      addLightning(currentBind);
      addListener({ queueId, key: currentBind, listener: onListenerCall });
    });

    return () => {
      binds.forEach((currentBind) => {
        removeLightning(currentBind);
        removeListener({ queueId, key: currentBind, listener: onListenerCall });
      });
    };
  }, [binds]);

  // on first render, there is no value, we use the default
  if (!value) {
    const resultValue = binds.reduce((acc, currentBind) => {
      acc[currentBind] = get(defaultValue, currentBind);
      return acc;
    }, {});

    return resultValue;
  }

  const resultValue = binds.reduce((acc, currentBind) => {
    acc[currentBind] = get(value, currentBind);
    return acc;
  }, {});

  return resultValue;
};
