import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_AVAILABLE_RESOURCES = 'GET_AVAILABLE_RESOURCES';
const GET_ALL_RESOURCES = 'GET_ALL_RESOURCES';
const ADD_RESOURCE = 'ADD_RESOURCE';
const EDIT_RESOURCE = 'EDIT_RESOURCE';
const DELETE_RESOURCE = 'DELETE_RESOURCE';

// Action Creators

export const getAvailableResources = createAction(
  GET_AVAILABLE_RESOURCES,
  service.getAvailableResources
);

export const getAllResources = createAction(
  GET_ALL_RESOURCES,
  service.getAllResources
);

export const addResource = createAction(
  ADD_RESOURCE,
  service.addResource
);

export const editResource = createAction(
  EDIT_RESOURCE,
  service.editResource
);

export const deleteResource = createAction(
  DELETE_RESOURCE,
  service.deleteResource
);

// Reducer

const initialState = {
  availableResources: [],
  resources: []
};

export default function reducer(state = initialState, action) {
  if (action.error) {
    console.log("Action has error:" + JSON.stringify(action));
    return state;
  }

  switch(action.type) {
    case GET_AVAILABLE_RESOURCES: {
      return { ...state, availableResources: action.payload }
    }
    case GET_ALL_RESOURCES: {
      return { ...state, resources: action.payload }
    }
    default:
      return state;
  }
}
