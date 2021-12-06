# react lightning context

A super performant lightning fast context library that only re-renders what has changed and is being listened to. This library is a drop in replacement of the React Context implementation. Best of all is only **12kb**!

## Why ?

When building web apps at scale one of the main problems is performance over time. When you have 20+ multiple teams contributing to a same code base it is impossible to **No**t hit this bottleneck on such big code bases. This library tries to mitigate some of this problem by providing a Context API that is reliant ant performant. It tries to avoid the un-necessary re-renders that the Context API has by only re-rendering what is upmost needed. As a result performance can be boosted dramatically.

## How to install

```terminal
  yarn add react-lightning-context
```

## How to use it without Hooks

The main idea is following the same patterns and api that React.Context with a little twist.

```jsx
  const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
  const LightningContext = createLightningContext(defaultValue);

  const ExampleA = () => ()
    <LightningContext.Provider>
      <LightningContext.Consumer listenTo={['valueC']}>
        {({ valueC }) => <label>{valueC}</label> }
      </Context.Consumer>
    </LightningContext.Provider>);
};
```

### What is going on here?

- `createLightningContext` is creating the context.
- `LightningContext.Provider` is defining the area in which the context data is going to be shared.
- `LightningContext.Consumer` will listen to changes in the Context value and will we re-rendered ONLY when the values on the `listenTo` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## How to use it with Hooks

The main idea ia following the same patterns and api that React.Context with a little twist. This is doing the same as the previouse example but with hooks.

```jsx
  const defaultValue = { valueA: { a: { b: 222, r: 333 } }, valueB: 222, valueC: 444 };
  const LightningContext = createLightningContext(defaultValue);

  const UseLightningContextHookComponent = () => {
    const { valueC } = useLightningContext({ listenTo: ['valueC'] }, LightningContext);
    return <label>{valueC}</label>;
  };

  const ExampleA = () => ()
    <LightningContext.Provider>
      <UseLightningContextHookComponent />
    </LightningContext.Provider>);
};
```

### What is going on here?

- `createLightningContext` is creating the context.
- `LightningContext.Provider` is defining the area in which the context data is going to be shared.
- `useLightningContext` will listen to changes in the Context value and will we be updated ONLY when the values on the `listenTo` prop in the context has changed. You can listen to more than one field, or you can go deep down into the props. ex: `valueA.a.r`.

## API Documentation

| Name                                                          | Supported ?     | Description                                                                                  |
| ------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------- |
| `React.createContext` **renamed to** `createLightningContext` | `Yes`           | It is how we create the context we use createLightningContext instead of React.createContext |
| `Context.Provider`                                            | `Yes`           |                                                                                              |
| `Class.contextType`                                           | `Not Supported` |                                                                                              |
| `Context.displayName`                                         | `Yes`           |                                                                                              |
| `Context.Consumer`                                            | `Yes`           | A way of consuming a context value using components. Similar to useContext                   |
| `useContext` **renamed to** `useLightningContext`             | `Yes`           | A way of consuming a context value using hook. Similar to useContext                         |
| `Context.Mutator`                                             | `New - Added`   | A component that provides a way of mutating the value of the context                         |
| `useLightningContextMutator`                                  | `New - Added`   | A Hook that provides a way of mutating the value of the context                              |

### createLightningContext

It follows a similar api that the `React.Context` does. It only differs that we have a second parameter with configuration options.

| Parameters       |                            | Types   | Required | Values                                                                                                                                                                                    |
| ---------------- | -------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First Parameter  | `defaultValue`             | Any     | **Yes**  | The default value to initialize the Context                                                                                                                                               |
| Second Parameter | `Options`                  | Object  | **No**   |                                                                                                                                                                                           |
|                  | `Options.waitBeforeUpdate` | Boolean |          | **Default: false**. This helps when you have a very volatile Context value, that is constantly mutating this helps by debouncing the updates so you can update the components less times. |

It **returns** the `Provider, Consumer, Mutator` components

#### Example

```js
const LightningContext = createLightningContext({ value: 'test' });

const LightningContext = createLightningContext({ value: 'test' }, { waitBeforeUpdate: true });
```

### Context.Provider

This does **No**t provides any props. Same as `React.Context` it wraps the context experience.

#### Example

```jsx
const LightningContext = createLightningContext({ value: 'test' });

const TopLevelExperience = () => {
  return <LightningContext.Provider>// ... your experience</LightningContext.Provider>;
};
```

### Context.Consumer

This need to be nested inside a `Provider` component. Same as `React.Context` it uses the function render pattern and it execution a function when it need to be render.

| Properties | Type          | Required | Description                                                                      |
| ---------- | ------------- | -------- | -------------------------------------------------------------------------------- |
| `listenTo` | Array<String> | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |

Ir **returns** a function that is executed passing a mapped object with the binding

#### Example

```jsx
const LightningContext = createLightningContext({ value: { first: 1, second: 2 } });

const TopLevelExperience = () => {
  return <LightningContext.Provider>
    <LightningContext.Consumer listenTo={['value.first', 'value.seconds']}>
    {
      (values) => //... anything to render
    }
    </LightningContext.Consumer>
  </LightningContext.Provider>;
};
```

#### Return value example

if **listenTo** is `['value.first', 'value.seconds']` the render function that will execute is

```js
  ({ 'value.first': 123, 'value.seconds': 333 }) => //...anything to render
```

### useLightningContext

Same as `Consumer` but as a Hook api (similar to the `useContext` hook)

| Properties       | Type                                 | Required | Description                                                                      |
| ---------------- | ------------------------------------ | -------- | -------------------------------------------------------------------------------- |
| `listenTo`       | Array<String>                        | **Yes**  | Properties from the `Context.value` that you want to listen to. It can be nested |
| LightningContext | createLightningContext return object | **Yes**  | The context you are using                                                        |

```js
const result = useLightningContext({ listenTo: [...] }, LightningContext);
```

### Context.Mutator

This need to be nested inside a `Provider` component. This is a component that provides a callback to update the internal context value. It uses the function render pattern and it execution a function when it need to be render passing the callback. No props are **available**.

It **returns** a function that is executed passing a callback function called `setContextValue`. This will updates the internal values and **ONLY** re-render what has changed and has someone listening.

#### Example

```jsx
const LightningContext = createLightningContext({ value: { first: 1, second: 2 } });

const TopLevelExperience = () => {
  return <LightningContext.Provider>
    <LightningContext.Mutator>
      {
        ({ setContextValue }) => //... anything that want to render and use setContextValue
      }
    </LightningContext.Mutator>
  </LightningContext.Provider>;
};
```

### useLightningContextMutator

Same as `Context.Mutator` but as a Hook.

| Properties       | Type                                 | Required | Description               |
| ---------------- | ------------------------------------ | -------- | ------------------------- |
| LightningContext | createLightningContext return object | **Yes**  | The context you are using |

#### Example

```jsx
const setContextValue = useLightningContextMutator(LightningContext);
```
