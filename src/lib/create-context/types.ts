import { FC, ReactNode, Context as ReactContext, ReactElement } from 'react';
import { INTERNAL } from '../constants';

export type InternalContextTypes = {
  queueId: string | undefined;
  addBinding: (val: string) => void;
  removeLightning: (val: string) => void;
  setContextValue: (val: any) => void | undefined;
};

export type CreateContextOptions = { waitBeforeUpdate: boolean };

export type SetContextValueFunction<ContextShape> = (f: (val: ContextShape) => ContextShape) => void;

export type Context<ContextShape> = {
  Provider: FC<{ children: ReactNode; initialValue?: ContextShape }>;
  Mutator: FC<{ children: (props: { setContextValue: SetContextValueFunction<ContextShape> }) => ReactElement }>;
  Consumer: FC<{ slices: string[]; children: (val: any) => ReactElement }>;
  [INTERNAL]: {
    InternalContext: ReactContext<InternalContextTypes>;
    defaultValue: ContextShape;
  };
  displayName: string | undefined;
};
