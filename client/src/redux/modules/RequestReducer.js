import { desks } from '../../resources/desks'
import { createAction } from 'redux-actions';

const MAKE_RESERVATION = 'MAKE_RESERVATION';

// Action Creators
export const makeReservation = createAction(MAKE_RESERVATION);

// Reducer
// TODO: Synchronize with database
const initialState = {
  employeeId: '000000000',
  resources: desks,
  reservations: []
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case MAKE_RESERVATION: {
      state.reservations.push({...action.payload, reservationId: String(Date.now())});
      return { ...state };
    }

    default:
      return state;
  }
}
