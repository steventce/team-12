import { desks } from '../../resources/desks'
import { reservations } from '../../resources/reservations'
import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_RESERVATIONS = 'GET_RESERVATIONS';
const GET_ADMIN_RESERVATIONS = 'GET_ADMIN_RESERVATIONS';
const MAKE_RESERVATION = 'MAKE_RESERVATION';
const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
const EDIT_RESERVATION = 'EDIT_RESERVATION';
const CONFIRM_RESERVATION = 'CONFIRM_RESERVATION';
const ABORT_RESERVATION = 'ABORT_RESERVATION';

const RESET_STATUS = 'RESET_STATUS';


// Action Creators

export const getReservations = createAction(GET_RESERVATIONS, service.getReservations);

export const getAdminReservations = createAction(GET_ADMIN_RESERVATIONS, service.getAllReservations);

export const cancelReservation = createAction(CANCEL_RESERVATION, (reservationId, callback) => {
  service.deleteReservation(reservationId);
  if (callback)
    callback()
});

export const editReservation = createAction(EDIT_RESERVATION, service.editReservation);

export const makeReservation = createAction(MAKE_RESERVATION, service.makeReservation);

export const resetStatus = createAction(RESET_STATUS);

export const confirmReservation = createAction(CONFIRM_RESERVATION, service.confirmReservation);

export const abortReservation = createAction(ABORT_RESERVATION, service.abortReservation);


// Reducer

const initialState = {
  employeeId: '00000',
  resources: desks,
  reservations: [],
  pendingReservation: { reservationId: '', transactionId: '' },
  status: '',
  errorMsg: '',
}

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    switch(action.type) {
      case CONFIRM_RESERVATION:
      case ABORT_RESERVATION:
      case MAKE_RESERVATION: {
        return { ...state, status: action.payload.response.status, errorMsg: action.payload.response.data }
      }
      default:
        return state;
    }
  }

  switch(action.type) {
    // TODO check user permission
    // TODO this stubs the database call by using hardcoded dummy data
    case GET_RESERVATIONS: {
      return { ...state, reservations: getObjValues(action.payload)}
    }
    case GET_ADMIN_RESERVATIONS: {
      // return parseAdminReservations(action.payload);
      return { ...state, reservations: getObjValues(action.payload)}
    }
    case MAKE_RESERVATION: {
      let pendingReservation = action.payload.data
      return { ...state, pendingReservation: { 
        reservationId: pendingReservation.reservation_id, 
        transactionId: pendingReservation.transaction_id
      }, status: action.payload.status}
    }
    case RESET_STATUS: {
      return { ...state, status: null, errorMsg: '' };
    }
    case CONFIRM_RESERVATION:
    case ABORT_RESERVATION:
      return { ...state, pendingReservation: {}, status: action.payload.status}
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
