import { locations } from '../../resources/locations'
import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_LOCATIONS = 'GET_LOCATIONS';
const EDIT_LOCATION = 'EDIT_LOCATION';
const ADD_LOCATION = 'ADD_LOCATION';
const DELETE_LOCATION = 'DELETE_LOCATION';

const RESET_STATUS = 'RESET_STATUS';
const SET_STATUS = 'SET_STATUS';

// Action Creators

export const getLocations = createAction(GET_LOCATIONS, service.getLocations);

export const editLocation = createAction(EDIT_LOCATION, (locationId, location) => {
  service.editLocation(locationId, location);
});

export const addLocation = createAction(ADD_LOCATION, (location) => {
  service.addLocation(location);
});

export const deleteLocation = createAction(DELETE_LOCATION, (locationId) => {
  service.deleteLocation(locationId);
});

export const resetStatus = createAction(
  RESET_STATUS
);

export const setStatus = createAction(
  SET_STATUS,
  (status) => { return status; }
);


// Reducer

const initialState = {
  locations: [],
  status: '',
  errors: []
}

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
  }

  switch(action.type) {
    case GET_LOCATIONS: {
      return { ...state, locations: action.payload}
    }
    case ADD_LOCATION:
    case EDIT_LOCATION:
    case DELETE_LOCATION: {
      if (action.error) {
        const { status, data } = action.payload.response;
        return {
          ...state,
          status: 'error',
          errors: data.errors || []
        }
      }
      return {
        ...state,
        status: 'success',
        errors: initialState.errors
      };
    }
    case RESET_STATUS: {
      const { status, errors } = initialState;
      return { ...state, status, errors };
    }
    case SET_STATUS: {
      return { ...state, status: action.payload };
    }
    default:
      return state;
  }
}
