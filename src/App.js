import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

import {
  bindActionCreators,
  createStore,
  combineReducers,
} from 'redux';


const UPDATE_QUERY_PARAMS = 'update_query_params'

const updateQueryParams = (state) => {
  return {
    type: UPDATE_QUERY_PARAMS,
    payload: state,
  }
};

const queryParams = (state = {}, action) => {
  const { payload } = action;
  if (action.type === UPDATE_QUERY_PARAMS) {
    const ret = {
      ...state,
      ...payload,
    };
    return ret;
  }
  return state;
};

const rootReducer = combineReducers({ queryParams });

const initialState = {
  queryParams: {
    q: ['ar'],
    buildings: ['smink', 'dinky'],
  },
};

const store = createStore(rootReducer, initialState);

const logState = () => {
  console.log(store.getState().queryParams);
}
store.subscribe(logState);

const triggerParams = () => {
  let result = '';

  const {queryParams} = store.getState();

  for (const key of Object.keys(queryParams)) {
    const values = queryParams[key];
    for (const value of values) {
      result += `${key}=${value}`;
    }
  }


  window.location.href = result;
}

store.subscribe(triggerParams);

const dispatchQueryParams = bindActionCreators(
  updateQueryParams,
  store.dispatch,
)

class Input extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  constructor() {
    super()
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.onSubmit({
        q: [e.target.value],
      })
    }
  }

  render() {
    return (
      <input
        onKeyPress={this.onKeyPress}
        placeholder={'search something'}
      />
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Input onSubmit={dispatchQueryParams} />
      </div>
    );
  }
}

export default App;
