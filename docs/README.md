# react-lightning-context

> This is a performant and simple react context

[![NPM](https://img.shields.io/npm/v/react-lightning-context.svg)](https://www.npmjs.com/package/react-lightning-context) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A super performant lightning fast context library that only re-renders what has changed and nothing else. This library is a drop in replacement of the official `React Context`.

## Why ?

When building web apps at scale one of the main problems is performance over time. When you have 20+ multiple teams contributing to a same code base it is impossible to not hit this bottleneck. This library tries to mitigate some of this problem by providing a `Context API` that is reliant ant performant. It tries to avoid the un-necessary re-renders problem that the `React Context` has by only re-rendering what is upmost needed. As a result performance can be boosted **dramatically**.

This is **NOT** a state management library. Just a performant `React Context` replacement. You can also mix this up with redux for example and get a full redux experience but this is outside the scope of this library.

## Libraries comparison

The bordered area is where the element is re-rendered. In the examples, the button is updating only one of the properties in the internal Context value.

| Using `react-lightning-context`           | Using `React Context`                  |
| ----------------------------------------- | -------------------------------------- |
| ![with gif](./media/with-op.gif?raw=true) | ![without gif](./media/without-op.gif) |

As you can see `react-lightning-context` only re-renders what has only changed vs `React Context` that re-renders everything within the `Provider`

## How to install

```terminal
  yarn add react-lightning-context
```

## How to use it without Hooks

The main idea is following the same patterns and api that `React Context` provides with a little twist.

```jsx
import { createContext } from 'react-lightning-context';
const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
const Context = createContext(defaultValue);

// `slices` can be (some examples):
// - valueA -> { a: { b: 222, r: 333 } }
// - valueA.a -> { b: 222, r: 333 }
// - valueA.a.b -> 222

const ExampleA = () => (
  <Context.Provider>
    <Context.Consumer slices={['valueC']}>{({ valueC }) => <label>{valueC}</label>}</Context.Consumer>
  </Context.Provider>
);
```

### What is going on here?

- `createContext` is creating the context.
- `Context.Provider` is defining the area in which the context data is going to be shared.
- `Context.Consumer` will listen to changes in the Context value and will re-rendered **ONLY** when the values on the `slices` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## How to use it with Hooks

The main idea ia following the same patterns and api that `React Context` provides with a little twist. This is doing the same as the previous example but with hooks.

```jsx
import { createContext, useContext } from 'react-lightning-context';
const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
const Context = createContext(defaultValue);

const UseLightningContextHookComponent = () => {
  const { valueC } = useContext({ slices: ['valueC'] }, Context);
  return <label>{valueC}</label>;
};

// `slices` can be (some examples):
// - valueA -> { a: { b: 222, r: 333 } }
// - valueA.a -> { b: 222, r: 333 }
// - valueA.a.b -> 222

const ExampleA = () => (
  <Context.Provider>
    <UseLightningContextHookComponent />
  </Context.Provider>
);
```

### What is going on here?

- `createContext` is creating the context.
- `Context.Provider` is defining the area in which the context data is going to be shared.
- `useContext` will listen to changes in the Context value and will be updated **ONLY** when the values on the `slices` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## What does this package exports?

- `createContext`
- `useContext`
- `useContextMutator`
- `useContextSliceMutator`
- `useContextReducer`

## Try it

[![Edit react-lightning-context](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/beautiful-currying-i7xin)

## API Documentation

| Name                                                 | Supported ? | Description                                                                         |
| ---------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `React.createContext` **renamed to** `createContext` | **Yes**     | It is how we create the context we use createContext instead of React.createContext |
| `Context.Provider`                                   | **Yes**     |                                                                                     |
| `Class.contextType`                                  | **No**      |                                                                                     |
| `Context.displayName`                                | **Yes**     |                                                                                     |
| `Context.Consumer`                                   | **Yes**     | A way of consuming a context value using components.                                |
| `useContext`                                         | **Yes**     | A way of consuming a context slices (one or many) using hook. Similar to useContext |
| `useContextSlice`                                    | **Yes**     | A way of consuming a context slice using hook. Similar to useContext                |
| `Context.Mutator`                                    | **New**     | A component that provides a way of mutating the value of the context                |
| `useContextMutator`                                  | **New**     | A Hook that provides a way of mutating the value of the context                     |
| `useContextSliceMutator`                             | **New**     | A Hook that provides a way of mutating only **one slice** of the context            |

### createContext

It follows a similar api that the `React.Context` provides. It only differs that we have a second parameter with configuration options.

| Parameters       |                            | Types   | Required | Values                                                                                                                                                                                                                                            |
| ---------------- | -------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First Parameter  | `defaultValue`             | Any     | **Yes**  | The default value to initialize the Context                                                                                                                                                                                                       |
| Second Parameter | `Options`                  | Object  | **No**   |                                                                                                                                                                                                                                                   |
|                  | `Options.waitBeforeUpdate` | Boolean |          | **Default: false**. This helps when you have a very volatile Context value, that is constantly mutating. This helps by debouncing the updates so you can update the components less times having a similar effect to the `concurrentMode` effect. |

It **returns** the `Provider, Consumer, Mutator` components

#### Example

```js
const Context = createContext({ value: 'test' });

const Context = createContext({ value: 'test' }, { waitBeforeUpdate: true });
```

### Context.Provider

This does not have any props. Same as `React.Context` it wraps the context experience.

#### Context.Provider Example

```jsx
import { createContext } from 'react-lightning-context';
const Context = createContext({ value: 'test' });

const TopLevelExperience = () => {
  return <Context.Provider>// ... your experience</Context.Provider>;
};
```

### Context.Consumer

This need to be nested inside a `Provider` component. Same as `React.Context` it uses the function render pattern and it execution a function when it need to be render.

| Properties | Type            | Required | Description                                                                      |
| ---------- | --------------- | -------- | -------------------------------------------------------------------------------- |
| `slices`   | Array< String > | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |

It **returns** a function that is executed passing a mapped object with the binding

#### Context.Consumer Example

```jsx
import { createContext } from 'react-lightning-context';
const Context = createContext({ value: { first: 1, second: 2 } });

const TopLevelExperience = () => {
  return <Context.Provider>
    <Context.Consumer slices={['value.first', 'value.seconds']}>
    {
      (values) => //... anything to render
    }
    </Context.Consumer>
  </Context.Provider>;
};
```

#### Return value example

if **slices** is `['value.first', 'value.seconds']` the render function that will execute is

```js
  ({ 'value.first': 123, 'value.seconds': 333 }) => //...anything to render
```

### useContext

Same as `Consumer` but as a Hook api (similar to the `useContext` hook)

| Properties      | Type                            | Required | Description                                                                      |
| --------------- | ------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `Object.slices` | Array<String>                   | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |
| `Context`       | `createContext` returned object | **Yes**  | The context you are using                                                        |

```js
import { useContext } from 'react-lightning-context';
const result = useContext({ slices: [...] }, Context);
```

### useContextSlice

Same as `Consumer` but as a Hook api (similar to the `useContext` hook)

| Properties | Type                            | Required | Description                                                                      |
| ---------- | ------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `slice`    | String                          | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |
| `Context`  | `createContext` returned object | **Yes**  | The context you are using                                                        |

```js
import { useContextSlice } from 'react-lightning-context';
const sliceFromContext = useContextSlice('property', Context);
```

### Context.Mutator

This need to be nested inside a `Provider` component. This is a component that provides a callback to update the internal context value. It uses the function render pattern and it execute a function when it need to be render passing the callback. No props are **available**.

It **returns** a function that is executed passing a callback function called `setContextValue`. This will updates the internal values and **ONLY** re-render what has changed and has someone listening.

#### Example calling setContextValue

The **value** parameter is the current context value

```js
setContextValue((value) => {
  return {
    ...value,
    ...yourChangeGoesHere,
  };
});
```

#### setContextValue Example

```jsx
import { createContext } from 'react-lightning-context';
const Context = createContext({ value: { first: 1, second: 2 } });

const TopLevelExperience = () => {
  return <Context.Provider>
    <Context.Mutator>
      {
        ({ setContextValue }) => //... anything that want to use setContextValue
      }
    </Context.Mutator>
  </Context.Provider>;
};
```

### useContextMutator

Same as `Context.Mutator` but as a Hook.

| Properties | Type                            | Required | Description               |
| ---------- | ------------------------------- | -------- | ------------------------- |
| `Context`  | `createContext` returned object | **Yes**  | The context you are using |

### useContextSliceMutator

This is same as the `useContextMutator` but only mutate one property of the `Context value`. As a result no need to merge anything.

| Properties     | Type                            | Required | Description                                             |
| -------------- | ------------------------------- | -------- | ------------------------------------------------------- |
| `Object.slice` | String                          | **Yes**  | The prop you are mutating, can be a nested property too |
| `Context`      | `createContext` returned object | **Yes**  | The context you are using                               |

#### useContextSliceMutator Example

```jsx
import { useContextSliceMutator } from 'react-lightning-context';
const setContextPropValue = useContextSliceMutator({ slice: 'object.valueA.valueB' }, Context);
```

#### Example calling setContextPropValue

The **propValue** parameter is the current context prop value

```js
setContextPropValue((propValue) => {
  // do anything you want
  return AnyNewPropValue;
});
```

### useContextReducer

This hook allow you to create a reducer to mutating the context value. This is helpful when you have to setup complex logic to update the context value. It is very similar to `useReducer` but the affected state is the context value.

| Properties       | Type                                        | Required | Description               |
| ---------------- | ------------------------------------------- | -------- | ------------------------- |
| `Object.reducer` | Function(currentValue, action) => nextValue | **Yes**  |                           |
| `Context`        | `createContext` returned object             | **Yes**  | The context you are using |

It **returns** the dispatch function to execute actions in the context value.

#### useContextReducer Example

```jsx
import { useContextReducer } from 'react-lightning-context';

function reducer(state, action) {
  switch (action.type) {
    case 'update':
      return { valA: 333, valB: 222, dummy: numberOfRendersA + 1 };
    default:
      throw new Error();
  }
}

const dispatch = useContextReducer(reducer, Context);
```

#### How to call it?

```js
dispatch({ type: 'update' });
```
