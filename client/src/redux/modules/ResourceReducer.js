import { createAction } from 'redux-actions';
import * as service from '../../service';

const GET_AVAILABLE_RESOURCES = 'GET_AVAILABLE_RESOURCES';
const GET_ALL_RESOURCES = 'GET_ALL_RESOURCES';
const ADD_RESOURCE = 'ADD_RESOURCE';
const EDIT_RESOURCE = 'EDIT_RESOURCE';
const DELETE_RESOURCE = 'DELETE_RESOURCE';
const RESET_STATUS = 'RESET_STATUS';
const SET_STATUS = 'SET_STATUS';

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

export const resetStatus = createAction(
  RESET_STATUS
);

export const setStatus = createAction(
  SET_STATUS,
  (status) => { return status; }
);

// Reducer

const initialState = {
  availableResources: [],
  resources: [],
  status: '',
  errors: []
};

export default function reducer(state = initialState, action) {
  if (action.error) {
    //console.log("Action has error:" + JSON.stringify(action));
  }

  switch(action.type) {
    case GET_AVAILABLE_RESOURCES: {
      return { ...state, availableResources: action.payload };
    }
    case GET_ALL_RESOURCES: {
      return { ...state, resources: action.payload };
    }
    case ADD_RESOURCE:
    case EDIT_RESOURCE:
    case DELETE_RESOURCE: {
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
