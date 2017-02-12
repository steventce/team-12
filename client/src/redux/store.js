import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import requestReducer from './modules/RequestReducer';
import promiseMiddleware from 'redux-promise';

// Create a logger for redux state changes
const logger = createLogger();

const reducer = combineReducers({
  db: requestReducer
});

// Add extensions to the redux store's dispatch() by applying middleware
const store = createStore(reducer, applyMiddleware(promiseMiddleware, logger));
export default store;
