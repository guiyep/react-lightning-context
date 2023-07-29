import { uuid } from '../uuid';
import type { QueueStore, Listener } from './types';

let queues: QueueStore = {};

export const initialize = () => {
  const uniqueId = uuid();

  if (queues[uniqueId]) {
    throw Error(`init queue with uuid ${uniqueId} caused a collision`);
  }

  queues[uniqueId] = {
    listeners: {},
  };
  return uniqueId;
};

export const publish = ({ queueId, key, event }: { queueId: string; key: string; event: any }) => {
  if (
    !queues[queueId] ||
    (queues[queueId] && !queues[queueId].listeners) ||
    (queues[queueId] && queues[queueId].listeners && !queues[queueId].listeners[key])
  ) {
    return;
  }

  queues[queueId].listeners[key].forEach((listener) => listener(event));
};

export const addListener = ({ queueId, key, listener }: Listener) => {
  if (!queues[queueId]) {
    return;
  }

  if (!queues[queueId].listeners) {
    queues[queueId].listeners = {};
  }

  if (!queues[queueId].listeners[key]) {
    queues[queueId].listeners[key] = [];
  }

  queues[queueId].listeners[key].push(listener);
};

export const removeListener = ({ queueId, key, listener }: Listener) => {
  if (
    !queues[queueId] ||
    (queues[queueId] && !queues[queueId].listeners) ||
    (queues[queueId] && queues[queueId].listeners && !queues[queueId].listeners[key])
  ) {
    return;
  }

  for (let i = 0; i < queues[queueId].listeners[key].length; i + 1) {
    if (queues[queueId].listeners[key][i] === listener) {
      queues[queueId].listeners[key].splice(i, 1);
      break;
    }
  }
};

export const flush = () => {
  queues = {};
};

export const flushQueue = ({ queueId }: { queueId: string }): void => {
  delete queues[queueId];
};

const deepFreeze = (obj: any) => {
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
  });
  return Object.freeze(obj);
};

export const getQueue = () => deepFreeze(queues);
