import React from 'react';
import { useLightningContextMutator } from './index';
import { useLightningContext } from '../useLightningContext';
import { createLightningContext } from '../../lib/create-lightning-context';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('useLightningContextMutator', () => {
  test('to not trigger uneeded updates', async () => {
    const Context = createLightningContext({ valA: 123, valB: 222 });

    let numberOfRendersA = 0;
    let numberOfRendersB = 0;

    const UseLightningContextComponentA = () => {
      const { valA } = useLightningContext({ listenTo: ['valA'] }, Context);
      numberOfRendersA++;
      return <label data-testid="testA">{valA}</label>;
    };

    const UseLightningContextComponentB = () => {
      const { valB } = useLightningContext({ listenTo: ['valB'] }, Context);
      numberOfRendersB++;
      return <label data-testid="testB">{valB}</label>;
    };

    const UseLightningContextMutatorComponent = () => {
      const setContextValue = useLightningContextMutator(Context);
      return <button onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRendersA + 1 }))} />;
    };

    const TestUpdateContext = () => {
      return (
        <>
          <Context.Provider>
            <UseLightningContextMutatorComponent />
            <UseLightningContextComponentA />
            <UseLightningContextComponentB />
          </Context.Provider>
        </>
      );
    };

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => screen.getByTestId('testA'));

    expect(screen.getByTestId('testA')).toHaveTextContent('333');

    // Why 2 ?... 1 initial render + 1 update
    expect(numberOfRendersA).toEqual(2);
    expect(numberOfRendersB).toEqual(1);
  });

  test('mutator to pass value', async () => {
    const Context = createLightningContext({ valA: 123, valB: 222 });

    let valueRef;

    const UseLightningContextMutatorComponent = () => {
      const setContextValue = useLightningContextMutator(Context);
      return (
        <button
          onClick={() =>
            setContextValue((value) => {
              valueRef = value;
              return { valA: 333, valB: 222 };
            })
          }
        />
      );
    };

    const TestUpdateContext = () => {
      return (
        <>
          <Context.Provider>
            <UseLightningContextMutatorComponent />
          </Context.Provider>
        </>
      );
    };

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(valueRef).toEqual({ valA: 123, valB: 222 });
    fireEvent.click(button);
    expect(valueRef).toEqual({ valA: 333, valB: 222 });
  });
});
