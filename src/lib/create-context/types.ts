import { FC, ReactNode, Context as ReactContext, ReactElement } from 'react';
import { INTERNAL } from '../constants';

export type InternalContextTypes = {
  queueId: string | undefined;
  addBinding: (val: string) => void;
  removeLightning: (val: string) => void;
  setContextValue: (val: any) => void | undefined;
};

export type CreateContextOptions = { waitBeforeUpdate: boolean };

export type SetContextValueFunction<StateShape> = (f: (val: StateShape) => StateShape) => void;

export type Context<StateShape> = {
  Provider: FC<{ children: ReactNode; initialValue?: StateShape }>;
  Mutator: FC<{ children: (props: { setContextValue: SetContextValueFunction<StateShape> }) => ReactElement }>;
  Consumer: FC<{ slices: string[]; children: (val: StateShape) => ReactElement }>;
  [INTERNAL]: {
    InternalContext: ReactContext<InternalContextTypes>;
    defaultValue: StateShape;
  };
  displayName: string | undefined;
};
