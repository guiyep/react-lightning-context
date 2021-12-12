# react-lightning-context

<p align="center">
  <img src="./assets/logo.png?raw=true">
</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/react-lightning-context.svg">
  <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
</p>

A super performant lightning fast context library that only re-renders what has changed and nothing else. This library is a drop in replacement of the official `React Context` and it is only **12kb**!!!!

## Why ?

When building web apps at scale one of the main problems is performance over time. When you have 20+ multiple teams contributing to a same code base it is impossible to not hit this bottleneck. This library tries to mitigate some of this problem by providing a `Context API` that is reliant ant performant. It tries to avoid the un-necessary re-renders problem that the `React Context` has by only re-rendering what is upmost needed. As a result performance can be boosted **dramatically**.

This is **NOT** a state management library. Just a performant `React Context` replacement. You can also mix this up with redux for example and get a full redux experience but this is outside the scope of this library.

## Libraries comparison

The bordered area is where the element is re-rendered. In the examples, the button is updating only one of the properties in the internal Context value.

| Using `react-lightning-context`            | Using `React Context`                   |
| ------------------------------------------ | --------------------------------------- |
| ![with gif](./assets/with-op.gif?raw=true) | ![without gif](./assets/without-op.gif) |

As you can see `react-lightning-context` only re-renders what has only changed vs `React Context` that re-renders everything within the `Provider`

## How to install

```terminal
  yarn add react-lightning-context
```

## How to use it without Hooks

The main idea is following the same patterns and api that `React Context` provides with a little twist.

```jsx
  import { createLightningContext } from 'react-lightning-context';
  const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
  const Context = createLightningContext(defaultValue);

  // `listenTo` can be (some examples):
  // - valueA -> { a: { b: 222, r: 333 } }
  // - valueA.a -> { b: 222, r: 333 }
  // - valueA.a.b -> 222

  const ExampleA = () => (
    <Context.Provider>
      <Context.Consumer listenTo={['valueC']}>
        {({ valueC }) => <label>{valueC}</label> }
      </Context.Consumer>
    </Context.Provider>);
};
```

### What is going on here?

- `createLightningContext` is creating the context.
- `Context.Provider` is defining the area in which the context data is going to be shared.
- `Context.Consumer` will listen to changes in the Context value and will re-rendered **ONLY** when the values on the `listenTo` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## How to use it with Hooks

The main idea ia following the same patterns and api that `React Context` provides with a little twist. This is doing the same as the previous example but with hooks.

```jsx
  import { createLightningContext, useLightningContext } from 'react-lightning-context';
  const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
  const Context = createLightningContext(defaultValue);

  const UseLightningContextHookComponent = () => {
    const { valueC } = useLightningContext({ listenTo: ['valueC'] }, Context);
    return <label>{valueC}</label>;
  };

  // `listenTo` can be (some examples):
  // - valueA -> { a: { b: 222, r: 333 } }
  // - valueA.a -> { b: 222, r: 333 }
  // - valueA.a.b -> 222

  const ExampleA = () => (
    <Context.Provider>
      <UseLightningContextHookComponent />
    </Context.Provider>);
};
```

### What is going on here?

- `createLightningContext` is creating the context.
- `Context.Provider` is defining the area in which the context data is going to be shared.
- `useLightningContext` will listen to changes in the Context value and will be updated **ONLY** when the values on the `listenTo` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## What does this package exports?

- `createLightningContext`
- `useLightningContext`
- `useLightningContextMutator`
- `useLightningContextPropMutator`

## Try it

[![Edit react-lightning-context](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/beautiful-currying-i7xin)

## API Documentation

| Name                                                          | Supported ? | Description                                                                                  |
| ------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `React.createContext` **renamed to** `createLightningContext` | **Yes**     | It is how we create the context we use createLightningContext instead of React.createContext |
| `Context.Provider`                                            | **Yes**     |                                                                                              |
| `Class.contextType`                                           | **No**      |                                                                                              |
| `Context.displayName`                                         | **Yes**     |                                                                                              |
| `Context.Consumer`                                            | **Yes**     | A way of consuming a context value using components.                                         |
| `useContext` **renamed to** `useLightningContext`             | **Yes**     | A way of consuming a context value using hook. Similar to useContext                         |
| `Context.Mutator`                                             | **New**     | A component that provides a way of mutating the value of the context                         |
| `useLightningContextMutator`                                  | **New**     | A Hook that provides a way of mutating the value of the context                              |
| `useLightningContextPropMutator`                              | **New**     | A Hook that provides a way of mutating only **one prop** of the context                      |

### createLightningContext

It follows a similar api that the `React.Context` provides. It only differs that we have a second parameter with configuration options.

| Parameters       |                            | Types   | Required | Values                                                                                                                                                                                                                                                  |
| ---------------- | -------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First Parameter  | `defaultValue`             | Any     | **Yes**  | The default value to initialize the Context                                                                                                                                                                                                             |
| Second Parameter | `Options`                  | Object  | **No**   |                                                                                                                                                                                                                                                         |
|                  | `Options.waitBeforeUpdate` | Boolean |          | **Default: false**. This helps when you have a very volatile Context value, that is constantly mutating. This helps by debouncing the updates so you can update the components less times having a similar effect with what `concurrentMode` will have. |

It **returns** the `Provider, Consumer, Mutator` components

#### Example

```js
const Context = createLightningContext({ value: 'test' });

const Context = createLightningContext({ value: 'test' }, { waitBeforeUpdate: true });
```

### Context.Provider

This does not have any props. Same as `React.Context` it wraps the context experience.

#### Example

```jsx
import { createLightningContext } from 'react-lightning-context';
const Context = createLightningContext({ value: 'test' });

const TopLevelExperience = () => {
  return <Context.Provider>// ... your experience</Context.Provider>;
};
```

### Context.Consumer

This need to be nested inside a `Provider` component. Same as `React.Context` it uses the function render pattern and it execution a function when it need to be render.

| Properties | Type            | Required | Description                                                                      |
| ---------- | --------------- | -------- | -------------------------------------------------------------------------------- |
| `listenTo` | Array< String > | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |

It **returns** a function that is executed passing a mapped object with the binding

#### Example

```jsx
import { createLightningContext } from 'react-lightning-context';
const Context = createLightningContext({ value: { first: 1, second: 2 } });

const TopLevelExperience = () => {
  return <Context.Provider>
    <Context.Consumer listenTo={['value.first', 'value.seconds']}>
    {
      (values) => //... anything to render
    }
    </Context.Consumer>
  </Context.Provider>;
};
```

#### Return value example

if **listenTo** is `['value.first', 'value.seconds']` the render function that will execute is

```js
  ({ 'value.first': 123, 'value.seconds': 333 }) => //...anything to render
```

### useLightningContext

Same as `Consumer` but as a Hook api (similar to the `useContext` hook)

| Properties        | Type                                     | Required | Description                                                                      |
| ----------------- | ---------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| `Object.listenTo` | Array<String>                            | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |
| `Context`         | `createLightningContext` returned object | **Yes**  | The context you are using                                                        |

```js
import { useLightningContext } from 'react-lightning-context';
const result = useLightningContext({ listenTo: [...] }, Context);
```

### Context.Mutator

This need to be nested inside a `Provider` component. This is a component that provides a callback to update the internal context value. It uses the function render pattern and it execute a function when it need to be render passing the callback. No props are **available**.

It **returns** a function that is executed passing a callback function called `setContextValue`. This will updates the internal values and **ONLY** re-render what has changed and has someone listening.

#### Example calling setContextValue

The **value** parameter is the updated context value

```js
setContextValue((value) => {
  return {
    ...value,
    ...yourChangeGoesHere,
  };
});
```

#### Example

```jsx
import { createLightningContext } from 'react-lightning-context';
const Context = createLightningContext({ value: { first: 1, second: 2 } });

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

### useLightningContextMutator

Same as `Context.Mutator` but as a Hook.

| Properties | Type                                     | Required | Description               |
| ---------- | ---------------------------------------- | -------- | ------------------------- |
| `Context`  | `createLightningContext` returned object | **Yes**  | The context you are using |

### useLightningContextPropMutator

This is same as the `useLightningContextMutator` but only mutate one property of the `Context value`. As a result no need to merge anything.

| Properties    | Type                                     | Required | Description                                             |
| ------------- | ---------------------------------------- | -------- | ------------------------------------------------------- |
| `Object.prop` | String                                   | **Yes**  | The prop you are mutating, can be a nested property too |
| `Context`     | `createLightningContext` returned object | **Yes**  | The context you are using                               |

#### Example

```jsx
import { useLightningContextPropMutator } from 'react-lightning-context';
const setContextPropValue = useLightningContextPropMutator({ props: 'object.valueA.valueB' }, Context);
```

#### Example calling setContextPropValue

The **value** parameter is the updated context value

```js
setContextPropValue((propValue) => {
  // do anything you want
  return AnyNewPropValue;
});
```
