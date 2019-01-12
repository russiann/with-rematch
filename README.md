# with-rematch

🕶 A HoC that implement reducer a la Rematch

## Instalation

```
npm install -g use-rematch
or
yarn add use-rematch
```

## Usage

```js
import withRematch from 'with-rematch';

const model = {
  state: 0,
  reducers: {
    increment(state) {
      return state + 1;
    },
    decrement(state) {
      return state - 1;
    }
  },
  effects: actions => ({
    async asyncIncrement(payload, state) {
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
  </View>
);

export default withRematch(model)(Counter);
```
