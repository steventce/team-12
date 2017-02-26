import { desks } from '../../resources/desks'
import { reservations } from '../../resources/reservations'
import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_RESERVATIONS = 'GET_RESERVATIONS';
const GET_ADMIN_RESERVATIONS = 'GET_ADMIN_RESERVATIONS';
const MAKE_RESERVATION = 'MAKE_RESERVATION';
const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
const EDIT_RESERVATION = 'EDIT_RESERVATION';
const GET_LOCATIONS = 'GET_LOCATIONS';

// Action Creators

export const getReservations = createAction(GET_RESERVATIONS);

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

export const getLocations = createAction(GET_LOCATIONS, service.getLocations);

export const makeReservation = createAction(MAKE_RESERVATION, service.makeReservation);

// Reducer

const initialState = {
  employeeId: '00000',
  resources: desks,
  reservations: [],
  locations: []
}

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    return state;
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
