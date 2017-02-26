import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import reservationReducer from './modules/ReservationReducer';
import promiseMiddleware from 'redux-promise';

// Create a logger for redux state changes
const logger = createLogger();

const reducer = combineReducers({
  db: reservationReducer
});

// Add extensions to the redux store's dispatch() by applying middleware
const store = createStore(reducer, applyMiddleware(promiseMiddleware, logger));
export default store;
