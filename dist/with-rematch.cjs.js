'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

const noop = () => {};
const defaults = {
  mapProps: props => props
};

/**
|--------------------------------------------------
| COMPONENTE
|--------------------------------------------------
*/

/**
|--------------------------------------------------
| WithRematch
|--------------------------------------------------
*/

const createReducer = model => (state = model.state, action) => {
  const reducer = model.reducers[action.type];
  return reducer ? reducer(state, action.payload, action.props) : state;
};

const createActions = (model, dispatch, props) => {
  return Object.keys(model.reducers || []).reduce(
    (actions, type) => ({
      ...actions,
      [type]: payload => dispatch({type, payload, props})
    }),
    {}
  );
};

const createEffects = (
  model,
  dispatch,
  actions,
  getState,
  props,
  getRef,
  helpers
) => {
  if (!model.effects) return {};
  const effects = model.effects(actions);
  return Object.keys(effects || []).reduce(
    (actions, type) => ({
      ...actions,
      [type]: payload => {
        return effects[type](payload, getState(), props, helpers, getRef);
      }
    }),
    {}
  );
};

const withRematch = (model, config = defaults) => WrappedComponent => {
  class WithRematch extends React.Component {
    constructor() {
      super();
      this.reducer = createReducer(model);
      this._refs = {};
      this.state = {
        stateValue: this.initializeStateValue()
      };
    }

    registerRef(path, ref) {
      return (this._refs[path] = ref);
    }

    getRef(path) {
      return this._refs[path];
    }

    initializeStateValue() {
      if (model.state !== undefined) {
        return typeof model.state === 'function'
          ? model.state(this.props)
          : model.state;
      }
      return this.reducer(undefined, {type: '@@withReducer/INIT'});
    }

    dispatch(action, callback = noop) {
      this.setState(
        ({stateValue}) => ({stateValue: this.reducer(stateValue, action)}),
        () => callback(this.state.stateValue)
      );
    }

    getState() {
      return this.state.stateValue;
    }

    init(helpers) {
      const dispatch = this.dispatch.bind(this);
      const getState = this.getState.bind(this);
      const getRef = this.getRef.bind(this);
      const state = this.state.stateValue;
      const {...props} = this.props;
      const actions = createActions(model, dispatch, props, getRef);
      const effects = createEffects(
        model,
        dispatch,
        actions,
        getState,
        props,
        getRef,
        helpers
      );
      this.actions = {...actions, ...effects};
      this.data = model.data;
      return {state, actions: this.actions};
    }

    componentWillMount() {
      this.init();

      if (model.lifecycle && model.lifecycle.componentWillMount) {
        model.lifecycle.componentWillMount.call(this);
      }
    }

    componentDidMount() {
      if (model.lifecycle && model.lifecycle.componentDidMount) {
        model.lifecycle.componentDidMount.call(this);
      }
    }

    componentWillReceiveProps(...args) {
      if (model.lifecycle && model.lifecycle.componentWillReceiveProps) {
        model.lifecycle.componentWillReceiveProps.call(this, ...args);
      }
    }

    shouldComponentUpdate(...args) {
      if (model.lifecycle && model.lifecycle.shouldComponentUpdate) {
        return model.lifecycle.shouldComponentUpdate.call(this, ...args);
      }
      return true;
    }

    componentWillUpdate(...args) {
      if (model.lifecycle && model.lifecycle.componentWillUpdate) {
        return model.lifecycle.componentWillUpdate.call(this, ...args);
      }
    }

    componentDidUpdate(...args) {
      if (model.lifecycle && model.lifecycle.componentDidUpdate) {
        model.lifecycle.componentDidUpdate.call(this, ...args);
      }
    }

    componentWillUnmount(...args) {
      if (model.lifecycle && model.lifecycle.componentWillUnmount) {
        model.lifecycle.componentWillUnmount.call(this, ...args);
      }
    }

    getChildContext(...args) {
      if (model.lifecycle && model.lifecycle.getChildContext) {
        return model.lifecycle.getChildContext.call(this, ...args);
      }
    }

    render() {
      const helpers = {registerRef: this.registerRef.bind(this)};
      const {state, actions} = this.init(helpers);

      const modelProps = config.mapProps({
        state: state,
        actions: actions,
        helpers
      });

      return React.createElement(WrappedComponent, {
        ...this.props,
        ...modelProps
      });
    }
  }

  WithRematch.propTypes = model.propTypes || null;
  WithRematch.contextTypes = model.contextTypes || null;
  WithRematch.childContextTypes = model.childContextTypes || null;

  return WithRematch;
};

module.exports = withRematch;
