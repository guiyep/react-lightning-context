import React from 'react';
import { useLightningContext } from './index';
import { createLightningContext } from '../../lib/create-lightning-context';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('useLightningContext', () => {
  test('to default to the initialValues and render once', () => {
    const Context = createLightningContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    const UseLightningContextComponent = () => {
      const { valA } = useLightningContext({ listenTo: ['valA'] }, Context);
      numberOfRenders++;
      return valA;
    };

    render(
      <Context.Provider>
        <UseLightningContextComponent />
      </Context.Provider>,
    );

    expect(screen.getByText('123')).toHaveTextContent('123');
    expect(numberOfRenders).toEqual(1);
  });

  test('to update state only once', async () => {
    const Context = createLightningContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    const UseLightningContextComponent = () => {
      const { valA } = useLightningContext({ listenTo: ['valA'] }, Context);
      numberOfRenders++;
      return <label data-testid="test">{valA}</label>;
    };

    const TestUpdateContext = () => {
      return (
        <>
          <Context.Provider>
            <Context.Mutator>
              {({ setContextValue }) => (
                <button onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRenders + 1 }))} />
              )}
            </Context.Mutator>
            <UseLightningContextComponent />
          </Context.Provider>
        </>
      );
    };

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => screen.getByTestId('test'));

    expect(screen.getByTestId('test')).toHaveTextContent('333');

    // Why 2 ?... 1 initial render + 1 update
    expect(numberOfRenders).toEqual(2);
  });

  test('to update state only once on multiple listenTo', async () => {
    const Context = createLightningContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    const UseLightningContextComponent = () => {
      const { valA, valB } = useLightningContext({ listenTo: ['valA', 'valB'] }, Context);
      numberOfRenders++;
      return (
        <label data-testid="test">
          {valA} - {valB}
        </label>
      );
    };

    const TestUpdateContext = () => {
      return (
        <>
          <Context.Provider>
            <Context.Mutator>
              {({ setContextValue }) => (
                <button onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRenders + 1 }))} />
              )}
            </Context.Mutator>
            <UseLightningContextComponent />
          </Context.Provider>
        </>
      );
    };

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => screen.getByTestId('test'));

    expect(screen.getByTestId('test')).toHaveTextContent('333 - 222');

    // Why 2 ?... 1 initial render + 1 update
    expect(numberOfRenders).toEqual(2);
  });

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

    const TestUpdateContext = () => {
      return (
        <>
          <Context.Provider>
            <Context.Mutator>
              {({ setContextValue }) => (
                <button
                  onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRendersA + 1 }))}
                />
              )}
            </Context.Mutator>
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
