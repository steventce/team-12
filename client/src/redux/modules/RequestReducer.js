import { desks } from '../../resources/desks'
import { reservations } from '../../resources/reservations'
import { createAction } from 'redux-actions';

const GET_RESERVATIONS = 'GET_RESERVATIONS';
const GET_ADMIN_RESERVATIONS = 'GET_ADMIN_RESERVATIONS';
const MAKE_RESERVATION = 'MAKE_RESERVATION';
const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
const EDIT_RESERVATION = 'EDIT_RESERVATION';

// Action Creators
export const getReservations = createAction(GET_RESERVATIONS);
export const getAdminReservations = createAction(GET_ADMIN_RESERVATIONS);

// TODO: Security concern passing in employeeId?
export const makeReservation = createAction(MAKE_RESERVATION, (reservation, employeeId, callback) => {
  // TODO: Replace with SQL call
  const reservationId = String(Date.now());
  reservations[reservationId] = {...reservation, reservationId, employeeId}
  if (callback)
    callback()
});
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

// Reducer
// TODO: Synchronize with database
const initialState = {
  employeeId: '00000', 
  resources: desks,
  reservations: []
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    //TODO check user permission
    // TODO this stubs the database call by using hardcoded dummy data
    case GET_RESERVATIONS: {
      return { ...state, reservations: getObjValues(reservations).filter(reservation => reservation.employeeId === state.employeeId)}
    }
    case GET_ADMIN_RESERVATIONS: {
      return { ...state, reservations: getObjValues(reservations)}
    }

    default:
      return state;
  }
}

function getObjValues(obj) {
    let values = [];

    for (var prop in obj) {
      if (reservations.hasOwnProperty(prop) && obj[prop] !== undefined )
        values.push(obj[prop]) 
    }
    return values;
}