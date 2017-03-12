import { desks } from '../../resources/desks'
import { reservations } from '../../resources/reservations'
import { locations } from '../../resources/locations'
import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_RESERVATIONS = 'GET_RESERVATIONS';
const GET_ADMIN_RESERVATIONS = 'GET_ADMIN_RESERVATIONS';
const MAKE_RESERVATION = 'MAKE_RESERVATION';
const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
const EDIT_RESERVATION = 'EDIT_RESERVATION';

const GET_LOCATIONS = 'GET_LOCATIONS';
const EDIT_LOCATION = 'EDIT_LOCATION';
const ADD_LOCATION = 'ADD_LOCATION';
const DELETE_LOCATION = 'DELETE_LOCATION';

// Action Creators

export const getReservations = createAction(GET_RESERVATIONS, service.getReservations);

export const getAdminReservations = createAction(GET_ADMIN_RESERVATIONS);

export const cancelReservation = createAction(CANCEL_RESERVATION, (reservationId, callback) => {
  // TODO: Replace with SQL call
  reservations[reservationId] = undefined;
  if (callback)
    callback()
});

export const editReservation = createAction(EDIT_RESERVATION, (reservation, callback) => {
  // TODO: Replace with SQL call
  reservations[reservation.reservationId] = Object.assign(reservations[reservation.reservationId], reservation)
  if (callback)
    callback()
});

export const makeReservation = createAction(MAKE_RESERVATION, service.makeReservation);


export const getLocations = createAction(GET_LOCATIONS, service.getLocations);

export const editLocation = createAction(EDIT_LOCATION, (location, callback) => {
  // TODO: Replace with SQL call
  locations[location.locationId] = Object.assign(locations[location.locationId], location)
  if (callback)
    callback()
});

export const addLocation = createAction(ADD_LOCATION, service.addLocation);

export const deleteLocation = createAction(DELETE_LOCATION, (locationId, callback) => {
  // TODO: Replace with SQL call
  locations[locationId] = undefined;
  if (callback)
    callback()
});


// Reducer

const initialState = {
  employeeId: '00000',
  resources: desks,
  reservations: [],
  locations: [],
  status: '',
}

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    switch(action.type) {
      case MAKE_RESERVATION: {
        return { ...state, status: '409' }
      }
      default:
        return state;
    }
  }

  switch(action.type) {
    // TODO check user permission
    // TODO this stubs the database call by using hardcoded dummy data
    case GET_RESERVATIONS: {
      return { ...state, reservations: getObjValues(reservations).filter(reservation => reservation.employeeId === state.employeeId)}
    }
    case GET_ADMIN_RESERVATIONS: {
      return { ...state, reservations: getObjValues(reservations)}
    }
    case GET_LOCATIONS: {
      return { ...state, locations: action.payload}
    }
    case MAKE_RESERVATION: {
      return { ...state, status: '201' };
    }
    default:
      return state;
  }
}

// Utility

function getObjValues(obj) {
    let values = [];

    for (var prop in obj) {
      if (reservations.hasOwnProperty(prop) && obj[prop] !== undefined )
        values.push(obj[prop])
    }
    return values;
}
