# react-lightning-context

<p align="center">
  <img src="./assets/logo.png?raw=true">
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/react-lightning-context">
    <img src="https://img.shields.io/npm/v/react-lightning-context.svg">
  </a>
  <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  <img src="https://img.shields.io/bundlephobia/minzip/react-lightning-context">
</p>

A super performant lightning fast context library that only re-renders what has changed and nothing else. This library is a drop in replacement of the official `React Context`.

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

## What to know more?

You can check the full library documentaiton here.

## How to use it with an easy example

The main idea ia following the same patterns and api that `React Context` provides with a little twist. This is doing the same as the previous example but with hooks.

```jsx
  import { createContext, useContext } from 'react-lightning-context';
  const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
  const Context = createContext(defaultValue);

  const UseLightningContextHookComponent = () => {
    const { valueC } = useContext({ slices: ['valueC'] }, Context);
    return <label>{valueC}</label>;
  };

  const ExampleA = () => (
    <Context.Provider>
      <UseLightningContextHookComponent />
    </Context.Provider>);
};
```

### What is going on here?

- `createContext` is creating the context.
- `Context.Provider` is defining the area in which the context data is going to be shared.
- `useContext` will listen to changes in the Context value and will be updated **ONLY** when the values on the `slices` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## Try it

[![Edit react-lightning-context](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/beautiful-currying-i7xin)
