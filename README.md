# with-rematch

🕶 A HoC that implement reducer a la Rematch

> Inpired By Rematch.js ♡

## Instalation

```
npm install -g with-rematch
or
yarn add with-rematch
```

## Getting Started

### Step 1: Model

```js
const model = {
  state: 0,
  reducers: {
    increment(state, payload, props) {
      console.log(state); // the state
      console.log(payload); // the payload passed via action
      console.log(props); // component props
      return state + (payload || 1);
    },
    decrement(state, payload, props) {
      return state - (payload || 1);
    }
  },
  effects: actions => ({
    async asyncIncrement(payload, state, props) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      actions.increment();
    }
  }),
  lifecycle: {
    componentDidMount() {
      console.log('componentDidMount', this);
    }
  }
};
```

Understanding models is as simple as answering a few questions:

1. What is my initial state? state
2. How do I change the state? reducers
3. How do I handle async actions? effects with async/await

### Step 2: HoC Props (state, actions)

Actions is how we trigger reducers & effects in your models. `actions` props standardizes your actions without the need for writing action types or action creators.

```js
// reducers
actions.increment();
actions.increment(5);
actions.decrement(2);

// effects
actions.asyncIncrement(10);
```

```js
const Counter = ({state, actions}) => (
  <div>
    Value: {state}
    <button onClick={actions.increment}>INCREMENT</Button>
    <button onClick={actions.decrement}>DENCREMENT</button>

    <button onClick={actions.asyncIncrement}>ASYNC INCREMENT</button>
    <button onClick={() => actions.increment(5)}>INCREMENT 5</Button>
  </View>
);

export default withRematch(model)(Counter);

```

### Step 3: Lifecycle

TODO

### Complete Example

```js
import withRematch from 'with-rematch';

const model = {
  state: 0,
  reducers: {
    increment(state, payload, props) {
      console.log(state);   // the state
      console.log(payload); // the payload passed via action
      console.log(props);   // component props
      return state + (payload || 1);
    },
    decrement(state, payload, props) {
      return state - (payload || 1);
    }
  },
  effects: actions => ({
    async asyncIncrement(payload, state, props) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      actions.increment();
    }
  }),
  lifecycle: {
    componentDidMount() {
      console.log('componentDidMount', this);
    }
  }
};

const Counter = ({state, actions}) => (
  <div>
    Value: {state}
    <button onClick={actions.increment}>INCREMENT</Button>
    <button onClick={actions.decrement}>DENCREMENT</button>

    <button onClick={actions.asyncIncrement}>ASYNC INCREMENT</button>
    <button onClick={() => actions.increment(5)}>INCREMENT 5</Button>
  </View>
);

export default withRematch(model)(Counter);
```
