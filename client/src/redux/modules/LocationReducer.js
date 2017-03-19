import { locations } from '../../resources/locations'
import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_LOCATIONS = 'GET_LOCATIONS';
const EDIT_LOCATION = 'EDIT_LOCATION';
const ADD_LOCATION = 'ADD_LOCATION';
const DELETE_LOCATION = 'DELETE_LOCATION';

// Action Creators

export const getLocations = createAction(GET_LOCATIONS, service.getLocations);

export const editLocation = createAction(EDIT_LOCATION, (locationId, location, callback) => {
  service.editLocation(locationId, location);
  if (callback)
    callback()
});

export const addLocation = createAction(ADD_LOCATION, (location, callback) => {
  service.addLocation(location);
  if (callback)
    callback()
});

export const deleteLocation = createAction(DELETE_LOCATION, (locationId, callback) => {
  service.deleteLocation(locationId);
  if (callback)
    callback()
});


// Reducer

const initialState = {
  locations: []
}

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    return state;
  }

  switch(action.type) {
    case GET_LOCATIONS: {
      return { ...state, locations: action.payload}
    }
    default:
      return state;
  }
}
