import React                            from 'react';
import { render }                       from 'react-dom';
import { Router, browserHistory }       from 'react-router';
import routes                           from 'routes';
import { createStore, combineReducers } from 'redux';
import { Provider }                     from 'react-redux';
import { fromJS }                       from 'immutable';
import * as reducers                    from 'reducers';

let initialState = window.__INITIAL_STATE__ || {};

// Transform into Immutable.js collections
Object
  .keys(initialState)
  .forEach(key => {
    initialState[key] = fromJS(initialState[key]);
  });

const reducer = combineReducers(reducers);
const store   = createStore(reducer, initialState);

render((
  <Provider store={ store }>
    <Router children={ routes } history={ browserHistory } />
  </Provider>
  ), document.getElementById('main')
);