import React from 'react';

import { createLightningContext } from '../lib/create-lightning-context';
import { useLightningContext } from '../hook/useLightningContext';

const Context = createLightningContext({ valueA: { a: { b: 222, r: 333 } }, valueB: 222 });

const UseLightningContextHookComponent = ({ bind }) => {
  const result = useLightningContext({ binds: [bind] }, Context);
  return (
    <div>
      {bind} : {result[bind]}
    </div>
  );
};

const Example = () => {
  return (
    <Context.Provider>
      <Context.Mutator>
        {({ setContextValue }) => (
          <button onClick={() => setContextValue(() => ({ valueA: { a: { b: 222, r: Math.random() } }, valueB: 222 }))}>
            {' '}
            click me!{' '}
          </button>
        )}
      </Context.Mutator>
      <UseLightningContextHookComponent bind="valueA.a.r" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueB" />
    </Context.Provider>
  );
};

export default {
  title: 'Example/Basic',
  component: Example,
};

const Template = (args) => <Example />;

export const LightingContext = Template.bind({});
LightingContext.args = {};
