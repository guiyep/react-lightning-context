import React, { useContext, useState } from 'react';
import Button from '@atlaskit/button';
import { get } from '../lib/get';
import { createContext } from '../lib/create-context';
import { useContext as useContextLightning } from '../hook/useContext';

const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
const LightningContext = createContext(defaultValue);
const ReactContext = React.createContext(defaultValue);

const Page = ({ children }) => <div style={{ fontFamily: 'arial' }}>{children}</div>;

const Container = ({ children }) => <div style={{ display: 'flex' }}>This is within another component: {children}</div>;

const UseLightningContextHookComponent = ({ bind }) => {
  const result = useContextLightning({ slices: [bind] }, LightningContext);
  return (
    <div>
      {bind} : {result[bind]}
    </div>
  );
};

const UseReactContextHookComponent = ({ bind }) => {
  const result = useContext(ReactContext);
  console.log(result);
  return (
    <div>
      {bind} : {get(result, bind)}
    </div>
  );
};

const ExampleA = () => (
  <Page>
    <LightningContext.Provider>
      <LightningContext.Mutator>
        {({ setContextValue }) => (
          <Button
            appearance="primary"
            onClick={() =>
              setContextValue(() => ({ valueA: { a: { b: 222, r: Math.random() } }, valueB: 222, valueC: 444 }))
            }
            style={{ marginBottom: '20px' }}
          >
            {' '}
            Generate random valueA{' '}
          </Button>
        )}
      </LightningContext.Mutator>
      <Container>
        <UseLightningContextHookComponent bind="valueA.a.r" />
      </Container>
      <UseLightningContextHookComponent bind="valueB" />
      <UseLightningContextHookComponent bind="valueC" />
    </LightningContext.Provider>
  </Page>
);

const ExampleB = () => {
  const [value, setValue] = useState(defaultValue);
  return (
    <Page>
      <ReactContext.Provider value={value}>
        <Button
          appearance="primary"
          style={{ marginBottom: '20px' }}
          onClick={() => setValue(() => ({ valueA: { a: { b: 222, r: Math.random() } }, valueB: 222, valueC: 444 }))}
        >
          {' '}
          Generate random valueA{' '}
        </Button>
        <Container>
          <UseReactContextHookComponent bind="valueA.a.r" />
        </Container>
        <UseReactContextHookComponent bind="valueB" />
        <UseReactContextHookComponent bind="valueC" />
      </ReactContext.Provider>
    </Page>
  );
};

export default {
  title: 'Example/Basic',
  component: ExampleA,
};

export const UsingLightingContext = () => <ExampleA />;

export const UsingReactContext = () => <ExampleB />;
