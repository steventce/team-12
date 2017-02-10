import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import request from './modules/Request';

// Create a logger for redux state changes
const logger = createLogger();

const reducer = combineReducers({
  request
});

// Add extensions to the redux store's dispatch() by applying middleware
const store = createStore(reducer, applyMiddleware(logger));
export default store;
