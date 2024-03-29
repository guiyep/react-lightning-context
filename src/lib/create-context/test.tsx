import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createContext } from './index';
import { INTERNAL } from '../constants';
import { flush } from '../pubsub/index';
import '@testing-library/jest-dom';

describe('createContext', () => {
  beforeEach(() => {
    flush();
  });

  test('to be defined', () => {
    expect(createContext).toBeDefined();
  });

  test('to create context', () => {
    const Context = createContext({ test: 123 });
    expect(Context.Provider).toBeDefined();
    expect(Context.Consumer).toBeDefined();
    expect(Context.Mutator).toBeDefined();
    expect(Context[INTERNAL].InternalContext).toBeDefined();
    expect(Context[INTERNAL].defaultValue).toBeDefined();
  });

  test('to default to the initialValues and render once', () => {
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    render(
      <Context.Provider>
        <Context.Consumer slices={['valA']}>
          {({ valA }) => {
            numberOfRenders++;
            return <div>{valA}</div>;
          }}
        </Context.Consumer>
      </Context.Provider>,
    );

    expect(screen.getByText('123')).toHaveTextContent('123');
    expect(numberOfRenders).toEqual(1);
  });

  test('to default to the initialValue in the provider component', () => {
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    render(
      <Context.Provider initialValue={{ valA: 555, valB: 222 }}>
        <Context.Consumer slices={['valA']}>
          {({ valA }) => {
            numberOfRenders++;
            return <div>{valA}</div>;
          }}
        </Context.Consumer>
      </Context.Provider>,
    );

    expect(screen.getByText('555')).toHaveTextContent('555');
    expect(numberOfRenders).toEqual(2);
  });

  test('to update state only once', async () => {
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    const TestUpdateContext = () => (
      <Context.Provider>
        <Context.Mutator>
          {({ setContextValue }) => (
            <button
              type="button"
              onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRenders + 1 }))}
            />
          )}
        </Context.Mutator>
        <Context.Consumer slices={['valA']}>
          {({ valA }) => {
            numberOfRenders++;
            return <label data-testid="test">{valA}</label>;
          }}
        </Context.Consumer>
      </Context.Provider>
    );

    render(<TestUpdateContext />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => screen.getByTestId('test'));
    await expect(screen.getByTestId('test')).toHaveTextContent('333');

    // Why 2 ?... 1 initial render + 1 update
    expect(numberOfRenders).toEqual(2);
  });

  test('to update state only once on multiple slices', async () => {
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRenders = 0;

    const TestUpdateContext = () => (
      <Context.Provider>
        <Context.Mutator>
          {({ setContextValue }) => (
            <button
              type="button"
              onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRenders + 1 }))}
            />
          )}
        </Context.Mutator>
        <Context.Consumer slices={['valA', 'valB']}>
          {({ valA, valB }) => {
            numberOfRenders++;
            return (
              <label data-testid="test">
                {valA} - {valB}
              </label>
            );
          }}
        </Context.Consumer>
      </Context.Provider>
    );

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
    const Context = createContext({ valA: 123, valB: 222 });

    let numberOfRendersA = 0;
    let numberOfRendersB = 0;

    const TestUpdateContext = () => (
      <Context.Provider>
        <Context.Mutator>
          {({ setContextValue }) => (
            <button
              type="button"
              onClick={() => setContextValue(() => ({ valA: 333, valB: 222, dummy: numberOfRendersA + 1 }))}
            />
          )}
        </Context.Mutator>
        <Context.Consumer slices={['valA']}>
          {({ valA }) => {
            numberOfRendersA++;
            return <label data-testid="testA">{valA}</label>;
          }}
        </Context.Consumer>
        <Context.Consumer slices={['valB']}>
          {({ valB }) => {
            numberOfRendersB++;
            return <label data-testid="testB">{valB}</label>;
          }}
        </Context.Consumer>
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

    const TestUpdateContext = () => (
      <Context.Provider>
        <Context.Mutator>
          {({ setContextValue }) => (
            <button
              type="button"
              onClick={() =>
                setContextValue((value) => {
                  valueRef = value;
                  return { valA: 333, valB: 222 };
                })
              }
            />
          )}
        </Context.Mutator>
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
