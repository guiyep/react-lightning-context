/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useContextReducer } from './index';
import { useContext } from '../useContext';
import { createContext } from '../../lib/create-context';
import '@testing-library/jest-dom';

describe('useContextReducer', () => {
  test.only('to not trigger uneeded updates', async () => {
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

    function reducer(state, action) {
      switch (action.type) {
        case 'update':
          return { valA: 333, valB: 222, dummy: numberOfRendersA + 1 };
        default:
          throw new Error();
      }
    }

    const UseLightningContextMutatorComponent = () => {
      const dispatch = useContextReducer(reducer, Context);
      return <button onClick={() => dispatch({ type: 'update' })} />;
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
});
