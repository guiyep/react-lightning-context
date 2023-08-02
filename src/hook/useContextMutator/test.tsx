import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useContextMutator, useContextSliceMutator } from './index';
import { useContext } from '../useContext';
import { createContext } from '../../lib/create-context';
import '@testing-library/jest-dom';

describe('useContextMutator', () => {
  test('to not trigger uneeded updates', async () => {
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRendersA = 0;
    let numberOfRendersB = 0;

    const UseLightningContextComponentA = () => {
      const { valA } = useContext({ slices: ['valA'] }, Context);
      numberOfRendersA++;
      return <label data-testid="testA">{valA}</label>;
    };

    const UseLightningContextComponentB = () => {
      const { valB } = useContext({ slices: ['valB'] }, Context);
      numberOfRendersB++;
      return <label data-testid="testB">{valB}</label>;
    };

    const UseLightningContextMutatorComponent = () => {
      const setContextValue = useContextMutator(Context);
      return (
        <button
          type="button"
          onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRendersA + 1 }))}
        />
      );
    };

    const TestUpdateContext = () => (
      <Context.Provider>
        <UseLightningContextMutatorComponent />
        <UseLightningContextComponentA />
        <UseLightningContextComponentB />
      </Context.Provider>
    );

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
    const Context = createContext({ valA: 123, valB: 222 });

    let valueRef;

    const UseLightningContextMutatorComponent = () => {
      const setContextValue = useContextMutator(Context);
      return (
        <button
          type="button"
          onClick={() =>
            setContextValue((value: any) => {
              valueRef = value;
              return { valA: 333, valB: 222 };
            })
          }
        />
      );
    };

    const TestUpdateContext = () => (
      <Context.Provider>
        <UseLightningContextMutatorComponent />
      </Context.Provider>
    );

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(valueRef).toEqual({ valA: 123, valB: 222 });
    fireEvent.click(button);
    expect(valueRef).toEqual({ valA: 333, valB: 222 });
  });
});

describe('useContextSliceMutator', () => {
  test('to not trigger uneeded updates', async () => {
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRendersA = 0;
    let numberOfRendersB = 0;

    const UseLightningContextComponentA = () => {
      const { valA } = useContext({ slices: ['valA'] }, Context);
      numberOfRendersA++;
      return <label data-testid="testA">{valA}</label>;
    };

    const UseLightningContextComponentB = () => {
      const { valB } = useContext({ slices: ['valB'] }, Context);
      numberOfRendersB++;
      return <label data-testid="testB">{valB}</label>;
    };

    const UseLightningContextMutatorComponent = () => {
      const setContextPropValue = useContextSliceMutator('valA', Context);
      return <button type="button" onClick={() => setContextPropValue(() => 333)} />;
    };

    const TestUpdateContext = () => (
      <Context.Provider>
        <UseLightningContextMutatorComponent />
        <UseLightningContextComponentA />
        <UseLightningContextComponentB />
      </Context.Provider>
    );

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
    const Context = createContext({ valA: 123, valB: 222 });

    let valueRef;

    const UseLightningContextMutatorComponent = () => {
      const setContextPropValue = useContextSliceMutator('valA', Context);
      return (
        <button
          type="button"
          onClick={() =>
            setContextPropValue((value) => {
              valueRef = value;
              return 333;
            })
          }
        />
      );
    };

    const TestUpdateContext = () => (
      <Context.Provider>
        <UseLightningContextMutatorComponent />
      </Context.Provider>
    );

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(valueRef).toEqual(123);
    fireEvent.click(button);
    expect(valueRef).toEqual(333);
  });
});
