export type ListenerEvent = (arg0: any) => void;

type Queue = {
  listeners: {
    [key: string]: Array<ListenerEvent>;
  };
};

export type Listener = { queueId: string; key: string; listener: ListenerEvent };

export type QueueStore = {
  [key: string]: Queue;
};
