import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import reservationReducer from './modules/ReservationReducer';
import resources from './modules/ResourceReducer';
import locations from './modules/LocationReducer';
import adminReducer from './modules/AdminReducer';
import promiseMiddleware from 'redux-promise';

// Create a logger for redux state changes
const logger = createLogger();

const reducer = combineReducers({
  db: reservationReducer,
  resources,
  locations,
  adminReducer
});

// Add extensions to the redux store's dispatch() by applying middleware
const store = createStore(reducer, applyMiddleware(promiseMiddleware, logger));
export default store;
