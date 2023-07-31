import { FC, ReactNode, Context, ReactElement } from 'react';
import { INTERNAL } from '../constants';

export type InternalContextTypes = {
  queueId: string | undefined;
  addBinding: (val: string) => void;
  removeLightning: (val: string) => void;
  setContextValue: (val: any) => void | undefined;
};

export type CreateContextOptions = { waitBeforeUpdate: boolean };

export type CreateContextResult<T1> = {
  Provider: FC<{ children: ReactNode; initialValue?: T1 }>;
  Mutator: FC<{ children: (props: { setContextValue: (f: (val: T1) => T1) => void }) => ReactElement }>;
  Consumer: FC<{ slices: string[]; children: (val: T1) => ReactElement }>;
  [INTERNAL]: {
    InternalContext: Context<InternalContextTypes>;
    defaultValue: T1;
  };
  displayName: string | undefined;
};
